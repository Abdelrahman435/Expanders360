import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ResearchDocument,
  ResearchDocumentSchema,
} from './schemas/research-document.schema';
import { ResearchDocumentsService } from './research-documents.service';
import { ResearchDocumentsController } from './research-documents.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ResearchDocument.name,
        schema: ResearchDocumentSchema,
      },
    ]),
  ],
  providers: [ResearchDocumentsService],
  controllers: [ResearchDocumentsController],
  exports: [ResearchDocumentsService],
})
export class ResearchDocumentsModule {}
