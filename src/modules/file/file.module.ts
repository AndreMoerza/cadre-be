import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileProviderModule } from './providers/provider.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationConfig } from '@app/interfaces/config.type';
import { FileUtil } from './common/utils/index.util';
import { MediaFile } from './models/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaFile]),
    FileProviderModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService<ApplicationConfig>) => {
        return FileUtil.getStorage(cfg);
      },
    }),
  ],
  providers: [FileService],
  exports: [],
  controllers: [FileController],
})
export class FileModule {}
