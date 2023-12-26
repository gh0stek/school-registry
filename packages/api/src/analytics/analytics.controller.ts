import { Controller, Get } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('subjects')
  async subjectsMetrics() {
    return this.analyticsService.getSubjectsMetrics()
  }

  @Get('students')
  async studentsMetrics() {
    return this.analyticsService.getStudentsMetrics()
  }
}
