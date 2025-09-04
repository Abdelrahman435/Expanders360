import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerOptions } from '@nestjs/throttler';

import { getMySQLConfig } from './database/mysql.config';
import { getMongoDBConfig } from './database/mongodb.config';

import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { VendorsModule } from './vendors/vendors.module';
import { MatchesModule } from './matches/matches.module';
import { ResearchDocumentsModule } from './research-documents/research-documents.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulingModule } from './scheduling/scheduling.module';

const throttlerConfig: ThrottlerOptions[] = [
  {
    ttl: 60,
    limit: 10,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMySQLConfig,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMongoDBConfig,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot(throttlerConfig),

    AuthModule,
    ClientsModule,
    ProjectsModule,
    VendorsModule,
    MatchesModule,
    ResearchDocumentsModule,
    AnalyticsModule,
    NotificationsModule,
    SchedulingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
