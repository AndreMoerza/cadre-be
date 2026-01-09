import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  env: process.env.APP_ENV || 'development',
  name: process.env.APP_NAME || 'NestJS App',
  version: process.env.APP_VERSION || '1.0.0',
  storage: process.env.APP_STORAGE || 'local', // local | s3
  maxFileSize: 10485760, // 10MB
  domain: process.env.APP_DOMAIN || 'http://localhost:4000',
  jwtExpires: '30d',
}));
