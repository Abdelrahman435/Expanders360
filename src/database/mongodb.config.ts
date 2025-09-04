import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const getMongoDBConfig = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri: configService.get(
    'MONGODB_URI',
    'mongodb://localhost:27017/project_vendor_matching',
  ),

  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
