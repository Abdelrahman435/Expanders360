import { Injectable, Logger } from '@nestjs/common';
import { MatchesRepository } from './matches.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { VendorsRepository } from '../vendors/vendors.repository';
import { Match } from './entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    private readonly matchesRepository: MatchesRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly vendorsRepository: VendorsRepository,
  ) {}

  async generateMatches(projectId: number): Promise<Match[]> {
    const project = await this.projectsRepository.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    const eligibleVendors = await this.findEligibleVendors(project);
    const matches: Match[] = [];

    for (const vendor of eligibleVendors) {
      const score = this.calculateMatchScore(project, vendor);
      const servicesOverlapCount = this.calculateServicesOverlap(
        project.services_needed,
        vendor.services_offered,
      );

      const match = await this.matchesRepository.createOrUpdate({
        project_id: projectId,
        vendor_id: vendor.id,
        score,
        services_overlap_count: servicesOverlapCount,
      });

      matches.push(match);
    }

    this.logger.log(
      `Generated ${matches.length} matches for project ${projectId}`,
    );
    return matches.sort((a, b) => b.score - a.score);
  }

  private async findEligibleVendors(project: Project): Promise<Vendor[]> {
    const allVendors = await this.vendorsRepository.findAll();

    return allVendors.filter((vendor) => {
      // Rule 1: Vendor must support the project's country
      const countrySupported = vendor.countries_supported.includes(
        project.country,
      );

      // Rule 2: Must have at least one service overlap
      const hasServiceOverlap =
        this.calculateServicesOverlap(
          project.services_needed,
          vendor.services_offered,
        ) > 0;

      // Rule 3: SLA should not be expired (optional check)
      const slaValid =
        !vendor.sla_expiry_date ||
        new Date(vendor.sla_expiry_date) > new Date();

      return countrySupported && hasServiceOverlap && slaValid;
    });
  }

  private calculateMatchScore(project: Project, vendor: Vendor): number {
    const servicesOverlap = this.calculateServicesOverlap(
      project.services_needed,
      vendor.services_offered,
    );

    const rating = vendor.rating;
    const slaWeight = this.calculateSLAWeight(vendor.response_sla_hours);

    // Formula: score = (services_overlap * 2) + rating + SLA_weight
    const score = servicesOverlap * 2 + rating + slaWeight;

    this.logger.debug(`Match score calculation for vendor ${vendor.id}:
      Services overlap: ${servicesOverlap} * 2 = ${servicesOverlap * 2}
      Rating: ${rating}
      SLA weight: ${slaWeight}
      Total score: ${score}`);

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  private calculateServicesOverlap(
    projectServices: string[],
    vendorServices: string[],
  ): number {
    const overlap = projectServices.filter((service) =>
      vendorServices.includes(service),
    );
    return overlap.length;
  }

  private calculateSLAWeight(responseSlaHours: number): number {
    // Convert SLA hours to a weight (lower hours = higher weight)
    // Max weight of 5 for 24-hour SLA, decreasing for longer SLAs
    if (responseSlaHours <= 24) return 5;
    if (responseSlaHours <= 48) return 4;
    if (responseSlaHours <= 72) return 3;
    if (responseSlaHours <= 168) return 2; // 1 week
    return 1;
  }

  async rebuildAllMatches(): Promise<void> {
    this.logger.log('Starting rebuild of all matches');

    const activeProjects = await this.projectsRepository.findByStatus('active');

    for (const project of activeProjects) {
      try {
        await this.generateMatches(project.id);
      } catch (error) {
        this.logger.error(
          `Failed to generate matches for project ${project.id}: ${error.message}`,
        );
      }
    }

    this.logger.log(
      `Completed rebuild of matches for ${activeProjects.length} active projects`,
    );
  }

  async getTopMatchesForProject(
    projectId: number,
    limit: number = 10,
  ): Promise<Match[]> {
    return await this.matchesRepository.findTopMatchesByProject(
      projectId,
      limit,
    );
  }
}
