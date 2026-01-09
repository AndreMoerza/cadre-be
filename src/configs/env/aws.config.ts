import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  s3Region: process.env.AWS_S3_REGION,
  s3AccessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  s3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  s3Bucket: process.env.AWS_S3_BUCKET,
}));
