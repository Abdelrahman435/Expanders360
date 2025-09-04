import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

import { Match } from '../matches/entities/match.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Project } from '../projects/entities/project.entity';

import {
  ResearchDocument,
  ResearchDocumentSchema,
} from '../research-documents/schemas/research-document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Vendor, Project]),
    MongooseModule.forFeature([
      { name: ResearchDocument.name, schema: ResearchDocumentSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
