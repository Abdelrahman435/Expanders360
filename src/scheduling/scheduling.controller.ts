import { Controller, Post, UseGuards } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('scheduling')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('trigger-sla-check')
  async triggerSLACheck() {
    await this.schedulingService.triggerSLACheck();
    return { message: 'Manual SLA check triggered' };
  }

  @Post('trigger-match-refresh')
  async triggerMatchRefresh() {
    await this.schedulingService.triggerMatchRefresh();
    return { message: 'Manual match refresh triggered' };
  }
}
