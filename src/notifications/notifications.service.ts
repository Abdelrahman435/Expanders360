import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MatchCreatedEvent,
  MatchUpdatedEvent,
  SLAExpiredEvent,
} from '../common/events/match.events';
import { EmailService } from './email.service';
import { ProjectsRepository } from '../projects/projects.repository';
import { VendorsRepository } from '../vendors/vendors.repository';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly projectsRepository: ProjectsRepository,
    private readonly vendorsRepository: VendorsRepository,
  ) {}

  @OnEvent('match.created')
  async handleMatchCreated(event: MatchCreatedEvent) {
    try {
      const project = await this.projectsRepository.findById(event.projectId);
      const vendor = await this.vendorsRepository.findById(event.vendorId);

      if (project && vendor) {
        await this.emailService.sendMatchNotification({
          to: project.client.contact_email,
          projectName: `Project in ${project.country}`,
          vendorName: vendor.name,
          matchScore: event.score,
        });

        this.logger.log(
          `Match notification sent for project ${event.projectId} and vendor ${event.vendorId}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send match notification: ${error.message}`);
    }
  }

  @OnEvent('match.updated')
  async handleMatchUpdated(event: MatchUpdatedEvent) {
    this.logger.log(
      `Match ${event.matchId} updated: score changed from ${event.oldScore} to ${event.newScore}`,
    );
    // Implement additional logic if needed for match updates
  }

  @OnEvent('sla.expired')
  async handleSLAExpired(event: SLAExpiredEvent) {
    try {
      // Send notification to admin about expired SLA
      await this.emailService.sendSLAExpirationNotification({
        vendorName: event.vendorName,
        expiryDate: event.expiryDate,
      });

      this.logger.log(
        `SLA expiration notification sent for vendor ${event.vendorId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send SLA expiration notification: ${error.message}`,
      );
    }
  }
}
