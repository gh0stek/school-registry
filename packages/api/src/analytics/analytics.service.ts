import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { calculateMedian, calculateAverage } from 'src/utils'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubjectsMetrics() {
    const dbResults = await this.prisma.subject.findMany({
      include: {
        grades: true,
      },
    })

    return dbResults.map((subject) => {
      const grades = subject.grades.map((grade) => grade.grade)

      const distribution = {}

      for (let i = 10; i <= 100; i += 10) {
        distribution[i] = grades.filter(
          (grade) => grade > i - 10 && grade <= i,
        ).length
      }

      distribution[10] += grades.filter((grade) => grade === 0).length

      return {
        subject: subject.name,
        id: subject.id,
        average: calculateAverage(grades),
        median: calculateMedian(grades),
        distribution,
      }
    })
  }

  async getStudentsMetrics() {
    const dbResults = await this.prisma.student.findMany({
      include: {
        grades: {
          select: {
            grade: true,
            subject: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return dbResults.map((student) => {
      const grades = student.grades.map((grade) => grade.grade)

      return {
        student: student.name,
        id: student.id,
        average: calculateAverage(grades),
        grades: student.grades.map((grade) => ({
          subject: grade.subject.name,
          grade: grade.grade,
        })),
      }
    })
  }
}
