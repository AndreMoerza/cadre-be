import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { MediaFile } from './models/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ApplicationConfig } from '@app/interfaces/config.type';
import { withTransaction } from '@app/utils/db.util';
import { FileUtil } from './common/utils/index.util';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppRequest } from '@app/interfaces/index.type';

@Injectable()
export class FileService {
  private client: S3Client;

  private bucket: string;

  private getPresignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: 24 * 60 * 60, // 1 day in seconds
    });
  }

  constructor(
    @InjectRepository(MediaFile)
    private readonly fileRepository: Repository<MediaFile>,

    private readonly configService: ConfigService<ApplicationConfig>,
  ) {
    this.client = new S3Client({
      region: this.configService.get('aws.s3Region', { infer: true }),
      credentials: {
        accessKeyId: this.configService.getOrThrow('aws.s3AccessKeyId', {
          infer: true,
        }),
        secretAccessKey: this.configService.getOrThrow(
          'aws.s3SecretAccessKey',
          {
            infer: true,
          },
        ),
      },
    });
    this.bucket = this.configService.get('aws.s3Bucket', { infer: true });
  }

  async getFiles(opts: FindManyOptions<MediaFile>) {
    const [files, count] = await this.fileRepository.findAndCount(opts);
    const privateFiles = files.filter((file) => file.private);
    const publicFiles = files.filter((file) => !file.private);
    const presignedPrivateFiles = await Promise.all(
      privateFiles.map(async (file) => {
        const url = await this.getPresignedUrl(file.key);
        return {
          ...file,
          path: url,
        };
      }),
    );
    const result = [...publicFiles, ...presignedPrivateFiles];
    return [result, count];
  }

  async getFile(id: string) {
    const file = await this.fileRepository.findOne({
      where: {
        id,
      },
    });

    if (!file) throw new NotFoundException(`File with id ${id} not found`);

    if (file.private) {
      const url = await this.getPresignedUrl(file.key);
      file.path = url;
      return file;
    }
    return file;
  }

  async uploadFiles(files: Express.Multer.File[], req: AppRequest) {
    return await withTransaction(this.fileRepository)(async (manager) => {
      const fileEntities = [] as MediaFile[];
      for (const file of files) {
        const fileEntity = new MediaFile();
        fileEntity.name = file.filename || file.originalname || 'unknown';
        fileEntity.mimeType = file.mimetype;
        fileEntity.path = FileUtil.getPath(this.configService, file);
        if ((file as Express.MulterS3.File)?.key) {
          fileEntity.key = (file as Express.MulterS3.File).key;
          fileEntity.bucket = (file as Express.MulterS3.File).bucket;
          const isPrivate =
            req.body?.private === 'true' || req.body?.private === true;
          fileEntity.private = isPrivate;
        }
        fileEntities.push(fileEntity);
      }

      return await manager.save(fileEntities);
    });
  }
}
