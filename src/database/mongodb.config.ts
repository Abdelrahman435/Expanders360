import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const getMongoDBConfig = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri: configService.get(
    'MONGODB_URI',
    'mongodb://localhost:27017/project_vendor_matching',
  ),
  // useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6.x and removed in 7.x
  // They are no longer needed and can be safely removed.
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
