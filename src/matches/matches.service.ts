import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Match } from './entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
  ) {}

  /**
   * Rebuild matches for a specific project
   */
  async rebuildMatchesForProject(projectId: number): Promise<void> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) return;

    const vendors = await this.vendorRepo.find({
      where: { countries_supported: In([project.country]) },
    });

    const matches: Match[] = [];

    for (const vendor of vendors) {
      const overlap = project.services_needed.filter((s) =>
        vendor.services_offered.includes(s),
      );
      if (overlap.length === 0) continue;

      const slaWeight =
        vendor.response_sla_hours <= 24
          ? 2
          : vendor.response_sla_hours <= 72
            ? 1
            : 0;

      const score = overlap.length * 2 + Number(vendor.rating) + slaWeight;

      const match = this.matchRepo.create({
        project_id: project.id,
        vendor_id: vendor.id,
        score,
        services_overlap_count: overlap.length,
      });

      matches.push(match);
    }

    if (matches.length > 0) {
      await this.matchRepo
        .createQueryBuilder()
        .insert()
        .into(Match)
        .values(matches)
        .orUpdate(
          ['score', 'services_overlap_count', 'updated_at'], //update columns
          ['project_id', 'vendor_id'], //unique constraint
        )
        .execute();
    }
  }

  async rebuildAllMatches(): Promise<void> {
    const projects = await this.projectRepo.find();
    for (const project of projects) {
      await this.rebuildMatchesForProject(project.id);
    }
  }
}
