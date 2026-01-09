import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './configs/env/app.config';
import dbConfig from './configs/env/db.config';
import { LoggerModule } from 'nestjs-pino';
import { UserModule } from './modules/user/user.module';
import { DataSource } from 'typeorm';
import { DatabaseConfig } from './db/typeorm.db';
import { TypeOrmModule } from '@nestjs/typeorm';
import awsConfig from './configs/env/aws.config';
import redisConfig from './configs/env/redis.config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { IsExist } from './validators/is-exists';
import { BullModule } from '@nestjs/bullmq';
import { ApplicationConfig } from './interfaces/config.type';
import mailConfig from './configs/env/mail.config';
import { EmployeeModule } from './modules/employee/employee.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';


const libs = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [appConfig, dbConfig, awsConfig, redisConfig, mailConfig],
    envFilePath: ['.env'],
  }),
  LoggerModule.forRoot({
    pinoHttp: {
      name: 'app',
      transport: {
        target: 'pino-pretty',
        options: {
          destination: 1,
          levelFirst: true,
          colorize: true,
          singleLine: true,
          sync: false,
          append: false,
          mkdir: true,
        },
        dedupe: true,
      },
      autoLogging: false,
    },
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
          `Failed to initialize the data source:: ${error?.message || 'UNKNOWN'
          }`,
        );
      }
    },
    inject: [ConfigService],
  }),
  CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ApplicationConfig>) => ({
      store: redisStore as any,
      host: configService.get('redis.host', { infer: true }),
      port: configService.get('redis.port', { infer: true }),
      ttl: 60,
    }),
  }),
  BullModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ApplicationConfig>) => ({
      connection: {
        host: configService.get('redis.host', { infer: true }),
        port: configService.get('redis.port', { infer: true }),
      },
      prefix: 'nvp:main:queue',
    }),
  }),
  PassportModule,
];

const modules = [
  EmployeeModule,
  AuthModule,
];

@Module({
  imports: [...libs, ...modules],
  providers: [IsExist],
})
export class AppModule { }
