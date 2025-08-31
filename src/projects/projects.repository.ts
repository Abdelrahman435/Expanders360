import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['client', 'matches'],
    });
  }

  async findByClientId(clientId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { client_id: clientId },
      relations: ['client', 'matches'],
    });
  }

  async findById(id: number): Promise<Project> {
    return await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'matches'],
    });
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    await this.projectRepository.update(id, updateProjectDto);
    return await this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.projectRepository.count();
  }

  async countByStatus(status: string): Promise<number> {
    return await this.projectRepository.count({ where: { status } });
  }

  async findExpansionProjectsByCountry(country: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: {
        country,
        is_expansion_project: true,
        status: 'active',
      },
    });
  }

  async findByStatus(status: string): Promise<Project[]> {
    return await this.projectRepository.find({ where: { status } });
  }
}
