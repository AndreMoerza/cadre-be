import { ApplicationConfig } from '@app/interfaces/config.type';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as multerS3 from 'multer-s3';
import { Request } from 'express';
import * as fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';

type MulterS3File = Express.Multer.File & {
  key?: string;
  bucket?: string;
  location?: string;
};

export class FileUtil {
  static getStorage(
    configService: ConfigService<ApplicationConfig>,
  ): MulterOptions {
    const app = configService.getOrThrow('app');
    const r2 = configService.getOrThrow('r2');

    const vaults = {
      local: () => {
        return diskStorage({
          destination: (req, file, cb) => {
            const clientPath = (req as any)?.body?.path || null;

            const folder = clientPath
              ? `./uploads/${file?.mimetype || 'unnamed'}/${clientPath}`
              : `./uploads/${file?.mimetype || 'unnamed'}`;

            fs.mkdirSync(folder, { recursive: true });
            return cb(null, folder);
          },
          filename: (_, file, cb) => {
            const base =
              file?.originalname?.split('.')?.slice(0, -1).join('.') ||
              (file as any)?.filename ||
              'file';

            const fn = `${base}.${Date.now()}${path.extname(file?.originalname)}`;
            return cb(null, fn);
          },
        });
      },

      // NOTE: key name "s3" kept for backward compatibility, but points to R2.
      s3: () => {
        const s3Instance = new S3Client({
          region: 'auto',
          endpoint: r2.endpoint, // https://<accountid>.r2.cloudflarestorage.com
          credentials: {
            accessKeyId: r2.accessKeyId,
            secretAccessKey: r2.secretAccessKey,
          },
          forcePathStyle: true, // IMPORTANT for R2
        });

        return multerS3({
          s3: s3Instance as any, // multer-s3 typings often mismatch
          bucket: r2.bucket,
          contentType: multerS3.AUTO_CONTENT_TYPE,
          metadata: (_req, file, cb) =>
            cb(null, { originalname: file.originalname }),
          key: (req: Request, file, cb) => {
            const clientPath = (req as any)?.body?.path || null;

            const isPrivate =
              (req as any)?.body?.private === 'true' ||
              (req as any)?.body?.private === true;

            const base =
              file?.originalname?.split('.')?.slice(0, -1).join('.') ||
              (file as any)?.filename ||
              'file';

            const fn = `${base}.${Date.now()}${path.extname(file?.originalname)}`;

            const prefix = isPrivate ? 'private/files' : 'public/files';

            if (clientPath) return cb(null, `${prefix}/${clientPath}/${fn}`);
            return cb(null, `${prefix}/${fn}`);
          },
        });
      },
    } as const;

    return {
      fileFilter(_, file, callback) {
        const allowed = /\.(jpg|jpeg|png|gif|webp|mp4|mov|mkv|webm|pdf|xlsx)$/i;

        if (!allowed.test(file.originalname)) {
          return callback(
            new Error(
              'Only image/video/pdf/xlsx files are allowed (jpg,jpeg,png,gif,webp,mp4,mov,mkv,webm,pdf,xlsx)',
            ),
            false,
          );
        }
        return callback(null, true);
      },

      storage: vaults[app.storage](),

      limits: {
        fileSize: app.maxFileSize,
      },
    };
  }

  static getPath(
    configService: ConfigService<ApplicationConfig>,
    file?: Express.MulterS3.File | Express.Multer.File,
  ) {
    const app = configService.getOrThrow('app');
    const r2 = configService.getOrThrow('r2');

    const vaults = {
      local: () => {
        if (!file) throw new Error('Local file not found');
        return `${app.domain}/${(file as any).path}`;
      },

      s3: () => {
        if (!file) throw new Error('S3/R2 file not found');

        const f = file as MulterS3File;

        // On some setups location might be undefined
        if (f.location) return f.location;

        if (r2.publicBaseUrl && f.key) {
          return `${r2.publicBaseUrl.replace(/\/$/, '')}/${f.key}`;
        }

        return f.key ?? '';
      },
    } as const;

    return vaults[app.storage]();
  }
}
