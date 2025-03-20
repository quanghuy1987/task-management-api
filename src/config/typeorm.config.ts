import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  isGlobal: true,
});

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env?.DB_PORT ? parseInt(process.env?.DB_PORT) : 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [],
  migrations: [__dirname + '/../database/migrations/*.ts'],
  logging: 'all',
});
