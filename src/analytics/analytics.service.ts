import { Injectable, Logger } from '@nestjs/common';
import { MatchesRepository } from '../matches/matches.repository';
import { ResearchDocumentsRepository } from '../research-documents/research-documents.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { VendorsRepository } from '../vendors/vendors.repository';

interface TopVendorsByCountry {
  country: string;
  vendors: {
    vendor_id: number;
    vendor_name: string;
    avg_score: number;
    match_count: number;
  }[];
  expansion_documents_count: number;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly matchesRepository: MatchesRepository,
    private readonly researchDocumentsRepository: ResearchDocumentsRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly vendorsRepository: VendorsRepository, // Inject VendorsRepository
  ) {}

  async getTopVendorsByCountry(
    days: number = 30,
  ): Promise<TopVendorsByCountry[]> {
    this.logger.log(
      `Generating top vendors by country report for last ${days} days`,
    );

    // Step 1: Get average scores by country and vendor from MySQL
    const vendorScores =
      await this.matchesRepository.getAverageScoreByCountryAndVendor(days);

    // Step 2: Group by country and get top 3 vendors per country
    const countryGroups = this.groupVendorsByCountry(vendorScores);

    // Step 3: For each country, get expansion project document counts from MongoDB
    const result: TopVendorsByCountry[] = [];

    for (const [country, vendors] of Object.entries(countryGroups)) {
      // Get expansion projects for this country
      const expansionProjects =
        await this.projectsRepository.findExpansionProjectsByCountry(country);
      const projectIds = expansionProjects.map((p) => p.id);

      // Count documents for these expansion projects
      let expansionDocumentsCount = 0;
      if (projectIds.length > 0) {
        const documents =
          await this.researchDocumentsRepository.findExpansionProjectDocuments(
            projectIds,
          );
        expansionDocumentsCount = documents.length;
      }

      result.push({
        country,
        vendors: vendors.slice(0, 3), // Top 3 vendors
        expansion_documents_count: expansionDocumentsCount,
      });
    }

    this.logger.log(`Generated report for ${result.length} countries`);
    return result.sort((a, b) => a.country.localeCompare(b.country));
  }

  private groupVendorsByCountry(vendorScores: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {}; // Corrected type annotation

    for (const score of vendorScores) {
      if (!groups[score.country]) {
        groups[score.country] = [];
      }

      groups[score.country].push({
        vendor_id: score.vendor_id,
        vendor_name: score.vendor_name,
        avg_score: parseFloat(score.avg_score),
        match_count: parseInt(score.match_count),
      });
    }

    // Sort vendors within each country by average score (descending)
    for (const country in groups) {
      groups[country].sort((a, b) => b.avg_score - a.avg_score);
    }

    return groups;
  }

  async getSystemOverview(): Promise<any> {
    // This method could provide general system statistics
    return {
      total_projects: await this.projectsRepository.count(),
      active_projects: await this.projectsRepository.countByStatus('active'),
      total_vendors: await this.vendorsRepository.count(),
      total_matches: await this.matchesRepository.count(),
      total_documents: await this.researchDocumentsRepository.count(),
    };
  }
}
