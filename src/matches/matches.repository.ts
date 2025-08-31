import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';

@Injectable()
export class MatchesRepository {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async createOrUpdate(createMatchDto: CreateMatchDto): Promise<Match> {
    const existingMatch = await this.matchRepository.findOne({
      where: {
        project_id: createMatchDto.project_id,
        vendor_id: createMatchDto.vendor_id,
      },
    });

    if (existingMatch) {
      await this.matchRepository.update(existingMatch.id, {
        score: createMatchDto.score,
        services_overlap_count: createMatchDto.services_overlap_count,
      });
      return await this.findById(existingMatch.id);
    } else {
      const match = this.matchRepository.create(createMatchDto);
      return await this.matchRepository.save(match);
    }
  }

  async findById(id: number): Promise<Match> {
    return await this.matchRepository.findOne({
      where: { id },
      relations: ['project', 'vendor'],
    });
  }

  async findTopMatchesByProject(
    projectId: number,
    limit: number,
  ): Promise<Match[]> {
    return await this.matchRepository.find({
      where: { project_id: projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
      take: limit,
    });
  }

  async findMatchesCreatedInLastDays(days: number): Promise<Match[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.project', 'project')
      .leftJoinAndSelect('match.vendor', 'vendor')
      .where('match.created_at >= :cutoffDate', { cutoffDate })
      .orderBy('match.score', 'DESC')
      .getMany();
  }

  async getAverageScoreByCountryAndVendor(days: number = 30): Promise<any[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await this.matchRepository
      .createQueryBuilder('match')
      .leftJoin('match.project', 'project')
      .leftJoin('match.vendor', 'vendor')
      .select([
        'project.country as country',
        'vendor.id as vendor_id',
        'vendor.name as vendor_name',
        'AVG(match.score) as avg_score',
        'COUNT(match.id) as match_count',
      ])
      .where('match.created_at >= :cutoffDate', { cutoffDate })
      .groupBy('project.country, vendor.id, vendor.name')
      .orderBy('project.country, avg_score', 'DESC')
      .getRawMany();
  }

  async count(): Promise<number> {
    return await this.matchRepository.count();
  }
}
