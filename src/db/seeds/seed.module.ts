import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../typeorm.db';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from '@app/configs/env/db.config';
import appConfig from '@app/configs/env/app.config';
import { UserFactoryModule } from './factories/user/user.factory.module';

@Module({
  imports: [
    UserFactoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
      dataSourceFactory: async (cfg) => {
        const dataSource = new DataSource(cfg);
        try {
          if (dataSource.isInitialized) {
            return dataSource;
          }
          await dataSource.initialize();
          return dataSource;
        } catch (error) {
          console.error(error);
          throw new Error(
            `Failed to initialize the data source:: ${
              error?.message || 'UNKNOWN'
            }`,
          );
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class SeedModule {}
