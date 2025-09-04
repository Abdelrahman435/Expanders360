import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MatchesService } from '../matches/matches.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly matchesService: MatchesService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get()
  async getMyProjects(@Req() req) {
    const clientId = req.user.sub;
    return this.projectsService.findByClient(clientId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post()
  async createProject(@Req() req, @Body() body) {
    const clientId = req.user.userId;
    return this.projectsService.createProject(clientId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/matches/rebuild')
  async rebuildMatches(@Param('id') id: number) {
    await this.matchesService.rebuildMatchesForProject(id);
    return { message: `Matches rebuilt for project ${id}` };
  }
}
