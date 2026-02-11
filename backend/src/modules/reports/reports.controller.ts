import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('daily')
  async getDailyReport(@Query('date') date: string, @Res() res: Response) {
    const doc = await this.reportsService.generateDailyReport(date);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="daily-report-${date}.pdf"`,
    });

    doc.pipe(res);
  }
}
