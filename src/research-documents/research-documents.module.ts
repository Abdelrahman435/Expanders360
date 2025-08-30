import { Module } from '@nestjs/common';
import { ResearchDocumentsService } from './research-documents.service';

@Module({
  providers: [ResearchDocumentsService]
})
export class ResearchDocumentsModule {}
