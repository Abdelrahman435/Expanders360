import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Match } from '../matches/entities/match.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Project } from '../projects/entities/project.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ResearchDocument,
  ResearchDocumentDocument,
} from '../research-documents/schemas/research-document.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Match)
    private readonly matchesRepo: Repository<Match>,

    @InjectRepository(Vendor)
    private readonly vendorsRepo: Repository<Vendor>,

    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,

    @InjectModel(ResearchDocument.name)
    private researchDocModel: Model<ResearchDocumentDocument>,
  ) {}

  async getTopVendorsPerCountry() {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const raw = await this.matchesRepo
      .createQueryBuilder('m')
      .select('p.country', 'country')
      .addSelect('v.id', 'vendor_id')
      .addSelect('v.name', 'vendor_name')
      .addSelect('AVG(m.score)', 'avg_score')
      .innerJoin('m.vendor', 'v')
      .innerJoin('m.project', 'p')
      .where('m.created_at >= :date', { date: last30Days })
      .groupBy('p.country, v.id, v.name')
      .orderBy('p.country')
      .addOrderBy('avg_score', 'DESC')
      .getRawMany();

    //Group vendors per country
    const grouped: Record<string, any[]> = {};
    for (const row of raw) {
      if (!grouped[row.country]) grouped[row.country] = [];
      grouped[row.country].push({
        vendorId: row.vendor_id,
        name: row.vendor_name,
        avgScore: Number(row.avg_score),
      });
    }

    for (const country of Object.keys(grouped)) {
      grouped[country] = grouped[country].slice(0, 3);
    }

    const expansionProjects = await this.projectsRepo.find({
      where: { is_expansion_project: true },
      select: ['id', 'country'],
    });

    const projectIds = expansionProjects.map((p) => p.id);
    const docs = await this.researchDocModel.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$projectId', count: { $sum: 1 } } },
    ]);

    const projectDocMap = Object.fromEntries(docs.map((d) => [d._id, d.count]));

    const countryDocCounts: Record<string, number> = {};
    for (const project of expansionProjects) {
      const count = projectDocMap[project.id] || 0;
      countryDocCounts[project.country] =
        (countryDocCounts[project.country] || 0) + count;
    }

    return Object.keys(grouped).map((country) => ({
      country,
      topVendors: grouped[country],
      expansionDocsCount: countryDocCounts[country] || 0,
    }));
  }
}
