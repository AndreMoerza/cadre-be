import { ApplicationConfig } from '@app/interfaces/config.type';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { Request } from 'express';
import * as fs from 'fs';

export class FileUtil {
  static getStorage(
    configService: ConfigService<ApplicationConfig>,
  ): MulterOptions {
    const vaults = {
      local: () => {
        return diskStorage({
          destination: (req, file, cb) => {
            const clientPath = req?.body?.path || null;
            if (clientPath) {
              fs.mkdirSync(`./uploads/${file?.mimetype}/${clientPath}`, {
                recursive: true,
              });
              return cb(null, `./uploads/${file?.mimetype}/${clientPath}`);
            }
            fs.mkdirSync(`./uploads/${file?.mimetype || 'unnamed'}`, {
              recursive: true,
            });
            return cb(null, `./uploads/${file?.mimetype || 'unnamed'}`);
          },
          filename: (_, file, cb) => {
            const fn = `${
              file?.originalname?.split('.')?.[0] || file?.filename || 'field'
            }.${Date.now()}${path.extname(file?.originalname)}`;
            return cb(null, fn);
          },
        });
      },
      s3: () => {
        const s3Instance = new S3Client({
          region: configService.get('aws.s3Region', { infer: true }),
          credentials: {
            accessKeyId: configService.getOrThrow('aws.s3AccessKeyId', {
              infer: true,
            }),
            secretAccessKey: configService.getOrThrow('aws.s3SecretAccessKey', {
              infer: true,
            }),
          },
        });

        return multerS3({
          s3: s3Instance,
          bucket: configService.getOrThrow('aws.s3Bucket', { infer: true }),
          contentType: multerS3.AUTO_CONTENT_TYPE,
          key: (req: Request, file, cb) => {
            const clientPath = req?.body?.path || null;
            let isPrivate = false;

            if (req?.body?.private) {
              isPrivate =
                req.body.private === 'true' || req.body.private === true;
            }

            const fn = `${
              file?.originalname?.split('.')?.[0] || file?.filename || 'field'
            }.${Date.now()}${path.extname(file?.originalname)}`;

            if (clientPath) {
              return cb(
                null,
                isPrivate
                  ? `private/files/${clientPath}/${fn}`
                  : `public/files/${clientPath}/${fn}`,
              );
            }
            return cb(
              null,
              isPrivate ? `private/files/${fn}` : `public/files/${fn}`,
            );
          },
        });
      },
    };
    return {
      fileFilter(_, file, callback) {
        if (
          !file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|xlsx|js|html|css)$/)
        ) {
          return callback(
            new Error('Only images and pdf files are allowed'),
            false,
          );
        }
        return callback(null, true);
      },
      storage: vaults[configService.get('app.storage', { infer: true })](),
      limits: configService.get('app.maxFileSize', { infer: true }),
    };
  }

  static getPath(
    configService: ConfigService<ApplicationConfig>,
    file?: Express.MulterS3.File | Express.Multer.File,
  ) {
    const vaults = {
      local: () => {
        return `${configService.get('app.domain', {
          infer: true,
        })}/${file.path}`;
      },
      s3: () => {
        if (!file) {
          throw new Error('S3 file not found');
        }
        return (file as Express.MulterS3.File)?.location;
      },
    };
    return vaults[configService.get('app.storage', { infer: true })]();
  }
}
