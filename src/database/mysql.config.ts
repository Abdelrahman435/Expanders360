import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getMySQLConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('MYSQL_HOST', 'localhost'),
  port: configService.get('MYSQL_PORT', 3306),
  username: configService.get('MYSQL_USERNAME', 'root'),
  password: configService.get('MYSQL_PASSWORD', ''),
  database: configService.get('MYSQL_DATABASE', 'project_vendor_matching'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  timezone: 'UTC',
  charset: 'utf8mb4',
});
