import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchDocumentsService } from './research-documents.service';
import { ResearchDocumentsController } from './research-documents.controller';
import {
  ResearchDocument,
  ResearchDocumentSchema,
} from './schemas/research-document.schema';
import { ResearchDocumentsRepository } from './research-documents.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResearchDocument.name, schema: ResearchDocumentSchema },
    ]),
  ],
  controllers: [ResearchDocumentsController],
  providers: [ResearchDocumentsService, ResearchDocumentsRepository],
  exports: [
    ResearchDocumentsService,
    ResearchDocumentsRepository,
    MongooseModule,
  ],
})
export class ResearchDocumentsModule {}
