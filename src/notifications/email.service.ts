import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MatchNotificationData {
  to: string;
  projectName: string;
  vendorName: string;
  matchScore: number;
}

interface SLAExpirationData {
  vendorName: string;
  expiryDate: Date;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  async sendMatchNotification(data: MatchNotificationData): Promise<void> {
    const subject = `New Vendor Match Found - Score: ${data.matchScore}`;
    const body = `
      Dear Client,
      
      We found a new vendor match for your project "${data.projectName}".
      
      Vendor: ${data.vendorName}
      Match Score: ${data.matchScore}
      
      Please log in to your dashboard to review the details.
      
      Best regards,
      Project Vendor Matching System
    `;

    await this.sendEmail(data.to, subject, body);
  }

  async sendSLAExpirationNotification(data: SLAExpirationData): Promise<void> {
    const adminEmail = this.configService.get(
      'ADMIN_EMAIL',
      'admin@example.com',
    );
    const subject = `SLA Expired - Vendor: ${data.vendorName}`;
    const body = `
      Dear Administrator,
      
      The SLA for vendor "${data.vendorName}" has expired on ${data.expiryDate.toDateString()}.
      
      Please review and update the vendor's SLA information.
      
      Best regards,
      Project Vendor Matching System
    `;

    await this.sendEmail(adminEmail, subject, body);
  }

  private async sendEmail(
    to: string,
    subject: string,
    body: string,
  ): Promise<void> {
    if (this.isProduction) {
      // In production, integrate with actual email service (SendGrid, AWS SES, etc.)
      // For now, we'll use a mock implementation
      this.logger.log(`[PRODUCTION] Email sent to ${to}: ${subject}`);
    } else {
      // In development/testing, log the email instead of sending
      this.logger.log(
        `[MOCK EMAIL] To: ${to}, Subject: ${subject}, Body: ${body}`,
      );
    }
  }
}
