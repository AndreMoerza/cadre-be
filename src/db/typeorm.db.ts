import { ApplicationConfig } from '@app/interfaces/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService<ApplicationConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.get('db.host', { infer: true }),
      port: this.configService.get('db.port', { infer: true }),
      username: this.configService.get('db.username', { infer: true }),
      password: this.configService.get('db.password', { infer: true }),
      database: this.configService.get('db.database', { infer: true }),
      autoLoadEntities: true,
      synchronize: false,
      dropSchema: false,
      logging: false, // Set to true to see SQL logs
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
      extra: {
        connectionLimit: 5,
      },
    };
  }
}
