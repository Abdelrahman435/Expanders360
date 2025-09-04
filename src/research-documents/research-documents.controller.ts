import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ResearchDocumentsService } from './research-documents.service';

@Controller('research-documents')
export class ResearchDocumentsController {
  constructor(private readonly researchService: ResearchDocumentsService) {}

  @Post()
  async create(@Body() dto: any) {
    return this.researchService.createDocument(dto);
  }

  @Get('project/:id')
  async findByProject(@Param('id') projectId: number) {
    return this.researchService.findByProject(Number(projectId));
  }
}
