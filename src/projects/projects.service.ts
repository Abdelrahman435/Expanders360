import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { MatchesService } from 'src/matches/matches.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly matchesService: MatchesService,
  ) {}

  async findByClient(clientId: number) {
    return this.projectRepository.find({
      where: { client_id: clientId },
    });
  }

  async createProject(clientId: number, dto: any) {
    const project = this.projectRepository.create({
      client_id: clientId,
      country: dto.country,
      services_needed: dto.services_needed,
      budget: dto.budget,
      status: dto.status ?? 'open',
    });
    const saved = await this.projectRepository.save(project);
    await this.matchesService.rebuildMatchesForProject(saved.id);
    return saved;
  }
}
