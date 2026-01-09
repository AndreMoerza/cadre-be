export interface DbConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  port: number;
  env: string;
  name: string;
  version: string;
  storage: 'local' | 's3';
  maxFileSize: number;
  domain: string;
  jwtExpires: string;
}

export interface AwsConfig {
  s3Region: string;
  s3AccessKeyId: string;
  s3SecretAccessKey: string;
  s3Bucket: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  sessionKey: string;
}
export interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface ApplicationConfig {
  app: AppConfig;
  db: DbConfig;
  aws: AwsConfig;
  redis: RedisConfig;
  mail: MailConfig;
}
