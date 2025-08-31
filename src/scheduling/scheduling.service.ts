import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchesService } from '../matches/matches.service';
import { VendorsRepository } from '../vendors/vendors.repository';
import { SLAExpiredEvent } from '../common/events/match.events';

@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(
    private readonly matchesService: MatchesService,
    private readonly vendorsRepository: VendorsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyMatchRefresh() {
    this.logger.log('Starting daily match refresh job');

    try {
      await this.matchesService.rebuildAllMatches();
      this.logger.log('Daily match refresh completed successfully');
    } catch (error) {
      this.logger.error(`Daily match refresh failed: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleSLAExpirationCheck() {
    this.logger.log('Starting SLA expiration check job');

    try {
      const expiredVendors = await this.vendorsRepository.findExpiredSLAs();

      for (const vendor of expiredVendors) {
        this.eventEmitter.emit(
          'sla.expired',
          new SLAExpiredEvent(vendor.id, vendor.name, vendor.sla_expiry_date),
        );
      }

      this.logger.log(
        `SLA expiration check completed. Found ${expiredVendors.length} expired SLAs`,
      );
    } catch (error) {
      this.logger.error(`SLA expiration check failed: ${error.message}`);
    }
  }

  @Cron('0 0 1 * *') // First day of every month at midnight
  async handleMonthlyAnalyticsGeneration() {
    this.logger.log('Starting monthly analytics generation job');

    try {
      // This could trigger analytics report generation
      // Implementation would depend on specific analytics requirements
      this.logger.log('Monthly analytics generation completed');
    } catch (error) {
      this.logger.error(
        `Monthly analytics generation failed: ${error.message}`,
      );
    }
  }

  // Manual trigger for testing purposes
  async triggerMatchRefresh(): Promise<void> {
    this.logger.log('Manual match refresh triggered');
    await this.handleDailyMatchRefresh();
  }

  async triggerSLACheck(): Promise<void> {
    this.logger.log('Manual SLA check triggered');
    await this.handleSLAExpirationCheck();
  }
}
