import { HttpException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UploadService } from './upload.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { PrismaService } from 'src/prisma/prisma.service'

async function clearDB(prisma: PrismaService) {
  return prisma.$transaction(async (transaction) => {
    await transaction.studentGrade.deleteMany()
    await transaction.student.deleteMany()
    await transaction.subject.deleteMany()
  })
}

describe('UploadService', () => {
  let service: UploadService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
      imports: [PrismaModule],
    }).compile()

    service = module.get<UploadService>(UploadService)
    prisma = module.get<PrismaService>(PrismaService)
    await clearDB(prisma)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  it('should add subjects and students', async () => {
    const subjects = ['English', 'Math', 'Science']
    const students = ['Jane', 'John']
    const studentsWithGrades = students.reduce((acc, student) => {
      return `${acc}${student},10,23,
      `
    }, '')
    const csv = `
    ,${subjects.join(',')}
    ${studentsWithGrades}
    `
    const file = Buffer.from(csv)
    await service.uploadCSV(file)
    const subjectsDB = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
    })
    expect(subjectsDB).toHaveLength(3)
    expect(subjectsDB.map((subject) => subject.name)).toEqual(subjects)
    const studentsDB = await prisma.student.findMany({
      orderBy: { name: 'asc' },
    })
    expect(studentsDB).toHaveLength(2)
    expect(studentsDB.map((student) => student.name)).toEqual(students)
  })
  it('should add grades', async () => {
    const subjects = ['English', 'Math', 'Science']
    const students = ['Jane', 'John']
    const studentsWithGrades = students.reduce((acc, student) => {
      return `${acc}${student},10,23,45
      `
    }, '')
    const csv = `
    ,${subjects.join(',')}
    ${studentsWithGrades}
    `
    const file = Buffer.from(csv)
    await service.uploadCSV(file)
    const grades = await prisma.studentGrade.findMany({
      orderBy: [{ student: { name: 'asc' } }, { subject: { name: 'asc' } }],
    })
    expect(grades).toHaveLength(6)
    expect(grades.map((grade) => grade.grade)).toEqual([10, 23, 45, 10, 23, 45])
  })
  it('should update grades', async () => {
    const subjects = ['English', 'Math', 'Science']
    const students = ['Jane', 'John']
    const studentsWithGrades = students.reduce((acc, student) => {
      return `${acc}${student},10,23,45
      `
    }, '')
    const csv = `
    ,${subjects.join(',')}
    ${studentsWithGrades}
    `
    const file = Buffer.from(csv)
    await service.uploadCSV(file)
    const studentsWithGradesUpdated = students.reduce((acc, student) => {
      return `${acc}${student},11,22,44
      `
    }, '')
    const csvUpdated = `
    ,${subjects.join(',')}
    ${studentsWithGradesUpdated}
    `
    const fileUpdated = Buffer.from(csvUpdated)
    await service.uploadCSV(fileUpdated)
    const grades = await prisma.studentGrade.findMany({
      orderBy: [{ student: { name: 'asc' } }, { subject: { name: 'asc' } }],
    })
    expect(grades).toHaveLength(6)
    expect(grades.map((grade) => grade.grade)).toEqual([11, 22, 44, 11, 22, 44])
  })
  it('should delete grades', async () => {
    const subjects = ['English', 'Math', 'Science']
    const students = ['Jane', 'John']
    const studentsWithGrades = students.reduce((acc, student) => {
      return `${acc}${student},10,23,45
      `
    }, '')
    const csv = `
    ,${subjects.join(',')}
    ${studentsWithGrades}
    `
    const file = Buffer.from(csv)
    await service.uploadCSV(file)
    const studentsWithGradesUpdated = students.reduce((acc, student) => {
      return `${acc}${student},,,
      `
    }, '')
    const csvUpdated = `
    ,${subjects.join(',')}
    ${studentsWithGradesUpdated}
    `
    const fileUpdated = Buffer.from(csvUpdated)
    await service.uploadCSV(fileUpdated)
    const grades = await prisma.studentGrade.findMany({
      orderBy: [{ student: { name: 'asc' } }, { subject: { name: 'asc' } }],
    })
    expect(grades).toHaveLength(0)
  })
  it('should throw an error if value in first column is empty', async () => {
    const subjects = ['English', 'Math', 'Science']
    const students = ['Jane', 'John']
    const studentsWithGrades = students.reduce((acc) => {
      return `${acc},,10,23,45
      `
    }, '')
    const csv = `
    ,${subjects.join(',')}
    ${studentsWithGrades}
    `
    const file = Buffer.from(csv)
    expect(service.uploadCSV(file)).rejects.toThrow(HttpException)
  })
})
