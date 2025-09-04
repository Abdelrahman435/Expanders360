import { Controller, Param, Post } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('projects/:projectId/matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  //✅ POST /projects/:projectId/matches/rebuild
  @Post('rebuild')
  async rebuildMatches(@Param('projectId') projectId: number) {
    return this.matchesService.rebuildMatchesForProject(Number(projectId));
  }
}
