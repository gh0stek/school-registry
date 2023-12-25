import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { parse, CsvError } from 'csv-parse'
import { getLogger } from '../logging'
import { isCSVStudentGrades } from 'dtos'

const logger = getLogger('UploadService')

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCSV(file: Buffer) {
    const parser = this.getCSVParser(file)

    return this.prisma.$transaction(async (transaction) => {
      try {
        for await (const record of parser) {
          if (!isCSVStudentGrades(record)) {
            logger.error('Invalid record', record)
            throw new HttpException(
              'Invalid record',
              HttpStatus.UNPROCESSABLE_ENTITY,
            )
          }

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
          if (subjects.length !== grades.length) {
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

          // filter out null grades. We will delete them later
          const studentGrades = grades.filter(([, value]) => value !== null)
          // delete all grades for this student
          await transaction.studentGrade.deleteMany({
            where: {
              studentId: student.id,
            },
          })

          // insert grades to DB only if they are not null
          await transaction.studentGrade.createMany({
            data: studentGrades.map(([key, value]) => ({
              studentId: student.id,
              subjectId: subjects.find((subject) => subject.name === key).id,
              grade: value as number,
            })),
          })
        }
      } catch (err) {
        logger.error('Error while parsing CSV', err)
        if (err instanceof CsvError) {
          throw new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY)
        }
        throw err
      }
    })
  }

  private getCSVParser(file: Buffer) {
    return parse(file, {
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
              `Value in first column cannot be empty in line ${context.lines}`,
              HttpStatus.UNPROCESSABLE_ENTITY,
            )
          }
          return value
        }
        if (value === '') {
          return null
        }
        const result = Number(value)
        if (isNaN(result)) {
          throw new HttpException(
            `Invalid value "${value}" in line ${context.lines}`,
            HttpStatus.UNPROCESSABLE_ENTITY,
          )
        }
        return result
      },
    })
  }
}
