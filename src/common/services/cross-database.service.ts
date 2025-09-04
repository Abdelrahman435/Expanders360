import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from '../../projects/projects.repository';
import { ResearchDocumentsRepository } from '../../research-documents/research-documents.repository';
import { CreateProjectDto } from '../../projects/dto/create-project.dto';
import { CreateResearchDocumentDto } from '../../research-documents/dto/create-research-document.dto';
import { Project } from '../../projects/entities/project.entity';
import { ResearchDocument } from '../../research-documents/schemas/research-document.schema';

@Injectable()
export class CrossDatabaseService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly researchDocumentsRepository: ResearchDocumentsRepository,
  ) {}

  async createProjectWithDocuments(
    createProjectDto: CreateProjectDto,
    documents: CreateResearchDocumentDto[],
  ): Promise<{ project: Project; documents: ResearchDocument[] }> {
    let createdProject: Project;
    const createdDocuments: ResearchDocument[] = [];

    try {
      //Step 1: Create project in MySQL
      createdProject = await this.projectsRepository.create(createProjectDto);

      //Step 2: Create documents in MongoDB with project reference
      for (const docDto of documents) {
        docDto.projectId = createdProject.id;
        const document = await this.researchDocumentsRepository.create(docDto);
        createdDocuments.push(document);
      }

      return { project: createdProject, documents: createdDocuments };
    } catch (error) {
      if (createdProject) {
        await this.projectsRepository.remove(createdProject.id);
      }

      for (const doc of createdDocuments) {
        await this.researchDocumentsRepository.remove(doc.id);
      }

      throw error;
    }
  }
}
