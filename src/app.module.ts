import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { ClientsController } from './clients/clients.controller';
import { ProjectsController } from './projects/projects.controller';
import { VendorsController } from './vendors/vendors.controller';
import { MatchesController } from './matches/matches.controller';
import { ResearchDocumentsController } from './research-documents/research-documents.controller';
import { AnalyticsController } from './analytics/analytics.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ResearchDocumentsModule } from './research-documents/research-documents.module';
import { MatchesModule } from './matches/matches.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProjectsModule } from './projects/projects.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AnalyticsModule,
    NotificationsModule,
    SchedulingModule,
    ResearchDocumentsModule,
    MatchesModule,
    VendorsModule,
    ProjectsModule,
    ClientsModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    AuthController,
    ClientsController,
    ProjectsController,
    VendorsController,
    MatchesController,
    ResearchDocumentsController,
    AnalyticsController,
    NotificationsController,
  ],
  providers: [AppService],
})
export class AppModule {}
