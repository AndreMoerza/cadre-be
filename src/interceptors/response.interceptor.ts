import { ApplicationConfig } from '@app/interfaces/config.type';
import { AppResponse } from '@app/interfaces/index.type';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, AppResponse<T>>
{
  configService: ConfigService<ApplicationConfig>;
  constructor(configService: ConfigService<ApplicationConfig>) {
    this.configService = configService;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<AppResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const isPaginated =
          data?.length && data?.length === 2 && typeof data?.[1] === 'number';
        const request = context.switchToHttp().getRequest() as Request;

        if (
          this.configService.get('app.env', { infer: true }) === 'development'
        ) {
          console.info(
            '[Request] URL ::',
            `(${request?.method}) - [${request?.url}]`,
          );
        }

        if (isPaginated) {
          const [res, total] = data as [T[], number];

          const pagination = {
            total,
            nextPage: 0,
            limit: 0,
            currentPage: 0,
          } as AppResponse<T>['pagination'];

          if (request?.query?.page) {
            pagination.currentPage = +request.query.page;
            pagination.nextPage = +request.query.page + 1;
          }

          if (request?.query?.limit) {
            pagination.limit = +request.query.limit;
          }

          // set `nextPage` to undefined if the current page is the last page
          if (pagination.limit * pagination.currentPage >= Math.ceil(total)) {
            pagination.nextPage = undefined;
          }

          return {
            message: data?.message || 'Success',
            status: context?.switchToHttp()?.getResponse()?.statusCode || 200,
            data: res,
            pagination,
          };
        }
        return {
          message: data?.message || 'Success',
          status: context?.switchToHttp()?.getResponse()?.statusCode || 200,
          data,
        };
      }),
    );
  }
}
