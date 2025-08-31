import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { MatchesModule } from '../matches/matches.module';
import { ResearchDocumentsModule } from '../research-documents/research-documents.module';
import { ProjectsModule } from '../projects/projects.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [
    MatchesModule,
    ResearchDocumentsModule,
    ProjectsModule,
    VendorsModule,
  ],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
