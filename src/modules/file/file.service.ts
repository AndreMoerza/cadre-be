import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { MediaFile } from './models/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ApplicationConfig, R2Config } from '@app/interfaces/config.type';
import { withTransaction } from '@app/utils/db.util';
import { FileUtil } from './common/utils/index.util';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppRequest } from '@app/interfaces/index.type';

type MulterS3File = Express.Multer.File & {
  key?: string;
  bucket?: string;
  location?: string;
};

@Injectable()
export class FileService {
  private readonly client: S3Client;
  private readonly r2: R2Config;

  constructor(
    @InjectRepository(MediaFile)
    private readonly fileRepository: Repository<MediaFile>,
    private readonly configService: ConfigService<ApplicationConfig>,
  ) {
    this.r2 = this.configService.getOrThrow('r2');

    this.client = new S3Client({
      region: 'auto',
      endpoint: this.r2.endpoint,
      credentials: {
        accessKeyId: this.r2.accessKeyId,
        secretAccessKey: this.r2.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  private publicUrl(key: string) {
    const base = this.r2.publicBaseUrl;
    return base ? `${base.replace(/\/$/, '')}/${key}` : key;
  }

  private getPresignedUrl(key: string, bucket?: string) {
    const command = new GetObjectCommand({
      Bucket: bucket ?? this.r2.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: 24 * 60 * 60, // 1 day
    });
  }

  async getFiles(opts: FindManyOptions<MediaFile>) {
    const [files, count] = await this.fileRepository.findAndCount(opts);

    const result = await Promise.all(
      files.map(async (file) => {
        // private -> presign
        if (file.private && file.key) {
          const url = await this.getPresignedUrl(file.key, file.bucket);
          return { ...file, path: url };
        }

        // public -> ensure path is public url (if key exists)
        if (!file.private && file.key) {
          return { ...file, path: file.path || this.publicUrl(file.key) };
        }

        return file;
      }),
    );

    return [result, count] as const;
  }

  async getFile(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new NotFoundException(`File with id ${id} not found`);

    if (file.private && file.key) {
      const url = await this.getPresignedUrl(file.key, file.bucket);
      return { ...file, path: url };
    }

    if (!file.private && file.key) {
      return { ...file, path: file.path || this.publicUrl(file.key) };
    }

    return file;
  }

  async uploadFiles(files: Express.Multer.File[], req: AppRequest) {
    return withTransaction(this.fileRepository)(async (manager) => {
      const isPrivate =
        req.body?.private === 'true' || req.body?.private === true;

      const fileEntities = files.map((f) => {
        const mf = new MediaFile();
        const s3f = f as MulterS3File;

        mf.name = (f as any).filename || f.originalname || 'unknown';
        mf.mimeType = f.mimetype;

        // key/bucket should be present if multer-s3 storage active
        mf.key = s3f.key ?? null;
        mf.bucket = s3f.bucket ?? this.r2.bucket;

        mf.private = Boolean(isPrivate);

        // Use FileUtil getPath which already handles local vs s3/r2
        mf.path = FileUtil.getPath(this.configService, f as any);

        // audit fields (optional, if entity has them)
        (mf as any).createdBy = req.user ?? null;
        (mf as any).updatedBy = req.user ?? null;

        return mf;
      });

      return manager.save(fileEntities);
    });
  }
}
