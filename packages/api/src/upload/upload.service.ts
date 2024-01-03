import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { parse, CsvError } from 'csv-parse'
import { getLogger } from '../logging'
import { CSVStudentGrades } from 'dtos'
import * as Joi from 'joi'

const logger = getLogger('UploadService')

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCSV(file: Buffer) {
    const parser = this.getCSVParser(file)

    try {
      await this.DBWriteHandler(parser)
    } catch (err) {
      logger.error('Error while parsing CSV', err)
      if (err instanceof CsvError) {
        throw new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY)
      }
      throw err
    }
  }

  async clearAll() {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.studentGrade.deleteMany()
      await transaction.student.deleteMany()
      await transaction.subject.deleteMany()
    })
  }

  private getCSVParser(file: Buffer) {
    const parser = parse(file, {
      trim: true,
      skip_empty_lines: true,

      columns: (header) =>
        header.map((column, index) => (index === 0 ? 'student' : column)),
      cast: (value, context) => {
        if (context.header) {
          return value
        }
        if (context.index === 0) {
          if (value === '') {
            throw new HttpException(
              `Value in first column cannot be empty. Line ${context.lines}`,
              HttpStatus.UNPROCESSABLE_ENTITY,
            )
          }
          return value
        }
        if (value === '') {
          return null
        }
        const schema = Joi.number().integer().min(0).max(100)
        const { error } = schema.validate(value)
        if (error) {
          throw new HttpException(
            `Invalid value "${value}". Line ${context.lines}. ${error.message}`,
            HttpStatus.UNPROCESSABLE_ENTITY,
          )
        }
        return +value
      },
    }).on('error', (err) => {
      parser.destroy(err)
    })
    return parser
  }

  private async DBWriteHandler(source: AsyncIterable<CSVStudentGrades>) {
    return this.prisma.$transaction(async (transaction) => {
      for await (const record of source) {
        let student = await transaction.student.findUnique({
          where: { name: record.student },
        })
        // insert student to DB if not exists
        if (!student) {
          student = await transaction.student.create({
            data: { name: record.student },
          })
        }

        const grades = Object.entries(record).filter(
          ([key]) => key !== 'student',
        )
        const subjects = await transaction.subject.findMany({
          where: { name: { in: grades.map(([key]) => key) } },
        })
        // insert subjects to DB if not exists
        if (subjects.length < grades.length) {
          const newSubjects = grades.filter(
            ([key]) => !subjects.find((subject) => subject.name === key),
          )
          await transaction.subject.createMany({
            data: newSubjects.map(([key]) => ({ name: key })),
          })
          const subjectsCreated = await transaction.subject.findMany({
            where: { name: { in: newSubjects.map(([key]) => key) } },
          })
          subjects.push(...subjectsCreated)
        }

        // delete null grades
        const gradesToDelete = grades
          .filter(([, value]) => value === null)
          .map(([key]) => subjects.find((subject) => subject.name === key).id)
        if (gradesToDelete.length > 0) {
          await transaction.studentGrade.deleteMany({
            where: {
              studentId: student.id,
              subjectId: { in: gradesToDelete },
            },
          })
        }

        const gradesToInsert = grades
          .filter(([, value]) => value !== null)
          .map(([key, value]) => ({
            subjectId: subjects.find((subject) => subject.name === key).id,
            studentId: student.id,
            grade: value as number,
          }))
        await Promise.all(
          gradesToInsert.map((studentGrade) =>
            transaction.studentGrade.upsert({
              where: {
                studentId_subjectId: {
                  studentId: studentGrade.studentId,
                  subjectId: studentGrade.subjectId,
                },
              },
              update: { grade: studentGrade.grade },
              create: studentGrade,
            }),
          ),
        )
      }
    })
  }
}
