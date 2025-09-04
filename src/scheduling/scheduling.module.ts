import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { MatchesModule } from '../matches/matches.module';
import { VendorsModule } from '../vendors/vendors.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MatchesModule, //SchedulingService depends on MatchesService
    VendorsModule, //SchedulingService depends on VendorsRepository
    EventEmitterModule, //For emitting SLA expired events
  ],
  providers: [SchedulingService],
  controllers: [SchedulingController],
  exports: [SchedulingService],
})
export class SchedulingModule {}
