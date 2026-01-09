import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch()
export class HttpExceptionInterceptor implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const status =
      typeof exception?.getStatus === 'function'
        ? exception?.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message =
      typeof exception?.getResponse === 'function'
        ? exception?.getResponse()
        : exception?.message || 'Unknown error';

    this.logger.error(`[ERROR] - [${new Date()}]`, exception, {
      url: request?.url || 'N/A',
      method: request?.method || 'N/A',
    });

    console.error(`[ERROR] - [${new Date()}]`, exception, {
      url: request?.url || 'N/A',
      method: request?.method || 'N/A',
    });

    httpAdapter.reply(
      response,
      {
        error: {
          statusCode: status,
          timestamp: new Date().toISOString(),
          message: message,
        },
      },
      status,
    );
  }
}
