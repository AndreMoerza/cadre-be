/**
 * Native productions NestJS Template
 * @author dwiyan
 */

import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import { HttpExceptionInterceptor } from './interceptors/exception.interceptor';
import { ConfigService } from '@nestjs/config';
import { ApplicationConfig } from './interfaces/config.type';
import { customValidationPipe } from './utils/pipes.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    bodyParser: true,
  });

  // you can custumize the cors here!
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  // setup for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const http = app.get(HttpAdapterHost);
  const pino = app.get(Logger);
  const reflector = app.get(Reflector);
  const config = app.get(ConfigService<ApplicationConfig>);

  app.set('trust proxy', true);

  // setup for pino logger
  app.useLogger(pino);
  app.flushLogs();
  // setup for security
  app.use(helmet());
  // setup for graceful shutdown
  app.enableShutdownHooks();
  // setup for global prefix
  app.setGlobalPrefix('api', { exclude: ['/', '/healthcheck'] });
  // setup for versioning
  app.enableVersioning({ type: VersioningType.URI });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
    setHeaders(res) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.removeHeader('Cross-Origin-Embedder-Policy');
    },
  });

  app.useBodyParser('json', { limit: '10mb' });

  // setup global filters & interceptors
  app.useGlobalFilters(new HttpExceptionInterceptor(http, pino));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalInterceptors(new ResponseInterceptor(config));
  app.useGlobalPipes(customValidationPipe);

  // setup swagger openapi documentation
  const swaggerCfg = new DocumentBuilder()
    .setTitle(config.getOrThrow('app.name', { infer: true }))
    .setDescription('Open API Documentation')
    .setVersion(config.getOrThrow('app.version', { infer: true }))
    .addBearerAuth()
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerCfg, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, swaggerDoc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Swagger Docs',
  });

  // start the application
  await app.listen(parseInt(config.getOrThrow('app.port', { infer: true })));
}
bootstrap();
