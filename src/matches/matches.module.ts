import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './entities/match.entity';
import { MatchesRepository } from './matches.repository';
import { ProjectsModule } from '../projects/projects.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    ProjectsModule, // MatchesService depends on ProjectsRepository
    VendorsModule, // MatchesService depends on VendorsRepository
  ],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesRepository],
  exports: [MatchesService, MatchesRepository, TypeOrmModule],
})
export class MatchesModule {}
