import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NO_ENTITY_FOUND,
  SWAGGER_SAMPLES,
  UNAUTHORIZED_REQUEST,
} from '@app/constants/app.constant';
import { InternalEntity } from '@app/db/base/base.entity';
import {
  AppGetOpts,
  AppPostOpts,
  AppRequest,
  Permission,
} from '@app/interfaces/index.type';
import { AccessControl } from '@app/modules/auth/providers/guards/access-control.guard';
import { MoneyUtil } from '@app/utils/money.util';
import {
  Delete,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  SetMetadata,
  Type,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiResponseProperty,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Column,
  ColumnOptions,
  ManyToOne,
  ObjectType,
  OneToMany,
  RelationOptions,
} from 'typeorm';

export const Me = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AppRequest['user'] => {
    const request = ctx.switchToHttp().getRequest() as AppRequest;
    return request.user;
  },
);

const queries = [
  {
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  },
  {
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit per page',
  },
  {
    name: 'search',
    required: false,
    type: String,
    description: 'Search query',
  },
  {
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort query',
  },
  {
    name: 'populate',
    required: false,
    type: String,
    description: 'Populate query',
  },
];

const defaultDecs = [
  ApiConsumes('application/json'),
  ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR }),
  ApiUnprocessableEntityResponse({ description: BAD_REQUEST }),
  ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST }),
  ApiNotFoundResponse({ description: NO_ENTITY_FOUND }),
];

const getQueries = (opts?: AppGetOpts) => {
  const pagination = [ApiBearerAuth()];

  const isContainAuth = Object.prototype.hasOwnProperty.call(opts, 'auth');
  if (isContainAuth && !Boolean(opts?.auth)) {
    pagination.pop();
  }

  const q = ApiQuery;

  if (opts?.paginated) {
    if (opts.paginated === true) {
      queries.forEach((query) => {
        pagination.push(
          q({
            name: query.name,
            required: query.required,
            type: query.type,
            description: query.description,
          }),
        );
      });
    } else {
      if (opts.paginated.page)
        pagination.push(
          q({
            name: 'page',
            required: false,
            type: Number,
            description: 'Page number',
          }),
        );
      if (opts.paginated.limit)
        pagination.push(
          q({
            name: 'limit',
            required: false,
            type: Number,
            description: 'Limit per page',
          }),
        );
      if (opts.paginated.search)
        pagination.push(
          q({
            name: 'search',
            required: false,
            type: String,
            description: 'Search query',
          }),
        );
      if (opts.paginated.sort)
        pagination.push(
          q({
            name: 'sort',
            required: false,
            type: String,
            description: 'Sort query',
          }),
        );
      if (opts.paginated.populate)
        pagination.push(
          q({
            name: 'populate',
            required: false,
            type: String,
            description: 'Populate query',
          }),
        );
    }
  }
  return pagination;
};

export function AppGet<T>(path?: string, opts?: AppGetOpts<T>) {
  const pagination = getQueries(opts);
  const internalDecs = [];
  if (opts?.summary) {
    internalDecs.push(
      ApiOperation({ summary: opts.summary }) as MethodDecorator &
        ClassDecorator,
    );
  }
  if (opts?.responseType) {
    internalDecs.push(ApiOkResponse({ type: opts.responseType as Type<T> }));
  }
  return applyDecorators(
    Get(path),
    HttpCode(HttpStatus.OK),
    ...pagination,
    ...defaultDecs,
    ...internalDecs,
  );
}

export function AppPost(path?: string, opts?: AppPostOpts) {
  const pagination = getQueries(opts);
  const internalDecs = [];
  if (opts?.summary) {
    internalDecs.push(
      ApiOperation({ summary: opts.summary }) as MethodDecorator &
        ClassDecorator,
    );
  }

  if (opts?.responseType) {
    internalDecs.push(ApiOkResponse({ type: opts.responseType }));
  }

  return applyDecorators(
    Post(path),
    HttpCode(opts?.statusCode || HttpStatus.CREATED),
    ...pagination,
    ...defaultDecs,
    ...internalDecs,
  );
}

export function AppPut(path?: string, opts?: AppPostOpts) {
  const pagination = getQueries(opts);
  const internalDecs = [];
  if (opts?.summary) {
    internalDecs.push(
      ApiOperation({ summary: opts.summary }) as MethodDecorator &
        ClassDecorator,
    );
  }
  if (opts?.responseType) {
    internalDecs.push(ApiOkResponse({ type: opts.responseType }));
  }
  return applyDecorators(
    Put(path),
    HttpCode(opts?.statusCode || HttpStatus.CREATED),
    ...pagination,
    ...defaultDecs,
    ...internalDecs,
  );
}

export function AppDel(path?: string, opts?: AppPostOpts) {
  const pagination = getQueries(opts);
  const internalDecs = [];
  if (opts?.summary) {
    internalDecs.push(
      ApiOperation({ summary: opts.summary }) as MethodDecorator &
        ClassDecorator,
    );
  }
  if (opts?.responseType) {
    internalDecs.push(ApiOkResponse({ type: opts.responseType }));
  }
  return applyDecorators(
    Delete(path),
    HttpCode(opts?.statusCode || HttpStatus.CREATED),
    ...pagination,
    ...defaultDecs,
    ...internalDecs,
  );
}

export function Claim(permission: Permission) {
  return SetMetadata('permission', [...permission.split(':')]);
}

export function GuardAccessControl() {
  return UseGuards(AuthGuard('jwt'), AccessControl);
}

export function Timestamp(opts?: ColumnOptions) {
  return applyDecorators(
    ApiProperty({ type: Date, example: new Date().toISOString() }),
    ApiResponseProperty({ type: Date, example: new Date().toISOString() }),
    Column({
      type: 'timestamptz',
      nullable: true,
      ...(opts || {}),
    }),
  );
}

export function MtO<T>(
  Entity: ObjectType<T>,
  key?: keyof Omit<T, keyof InternalEntity>,
  opts?: RelationOptions,
) {
  const keyName = key || 'id';
  return applyDecorators(
    ApiProperty({ type: Entity, example: SWAGGER_SAMPLES.id }),
    ApiResponseProperty({ type: Entity, example: SWAGGER_SAMPLES.id }),
    ManyToOne(
      () => Entity,
      (f) => f[keyName as keyof T], // Fix: Add 'as keyof T' to ensure keyName is a valid property of T
      { nullable: true, eager: false, ...(opts || {}) },
    ),
  );
}

export function Json<T = any>(opts: ColumnOptions = {}) {
  return Column({
    type: 'jsonb',
    transformer: {
      to(value: T): string {
        return JSON.stringify(value);
      },
      from(value: string): T {
        const isJsonAble =
          value?.startsWith('{') || value?.startsWith('[') || false;
        if (!isJsonAble) return null;
        return JSON.parse(value);
      },
    },
    nullable: true,
    ...opts,
  });
}

export function OtM<T>(
  Entity: ObjectType<T>,
  key: keyof Omit<T, keyof InternalEntity>,
  opts?: RelationOptions,
) {
  return applyDecorators(
    ApiProperty({ type: Entity, example: SWAGGER_SAMPLES.ids }),
    ApiResponseProperty({ type: Entity, example: SWAGGER_SAMPLES.ids }),
    OneToMany(
      () => Entity,
      (f) => f[key],
      { nullable: true, eager: false, ...(opts || {}) },
    ),
  );
}

export function Money(opts: ColumnOptions = {}) {
  return applyDecorators(
    opts.nullable
      ? IsOptional()
      : IsNotEmpty({
          message: 'This field is required',
        }),
    ApiProperty({ type: Number, example: 20000 }),
    ApiResponseProperty({ type: Number, example: 20000 }),
    Column({
      type: 'money',
      nullable: true,
      transformer: {
        from(value) {
          return MoneyUtil.normalize(value);
        },
        to(value) {
          return value;
        },
      },
      ...opts,
    }),
  );
}

export function Int(opts: ColumnOptions = {}) {
  return applyDecorators(
    opts.nullable
      ? IsOptional()
      : IsNotEmpty({
          message: 'This field is required',
        }),
    ApiProperty({ type: Number, example: 20 }),
    ApiResponseProperty({ type: Number, example: 20 }),
    Column({ type: 'int', nullable: true, ...opts }),
  );
}

export function TextCol(opts: ColumnOptions = {}) {
  return applyDecorators(
    opts.nullable
      ? IsOptional()
      : IsNotEmpty({
          message: 'This field is required',
        }),
    ApiProperty({ type: String, example: 'Any text (unlimited)' }),
    ApiResponseProperty({ type: String, example: 'Any text (unlimited)' }),
    Column({ type: 'text', nullable: true, ...opts }),
  );
}

export function Bool(opts: ColumnOptions = {}) {
  return applyDecorators(
    opts.nullable
      ? IsOptional()
      : IsNotEmpty({
          message: 'This field is required',
        }),
    ApiProperty({ type: Boolean, example: true }),
    ApiResponseProperty({ type: Boolean, example: true }),
    Column({ type: Boolean, nullable: true, ...opts }),
  );
}

export function Varchar(len?: number, opts: ColumnOptions = {}) {
  const length = len || 255;
  return applyDecorators(
    opts.nullable
      ? IsOptional()
      : IsNotEmpty({
          message: 'This field is required',
        }),
    ApiProperty({ type: String, example: 'Any text (max 255.)' }),
    ApiResponseProperty({ type: String, example: 'Any text (max 255.)' }),
    Column({ type: 'varchar', length, nullable: true, ...opts }),
  );
}

export function Enum(opts: ColumnOptions = {}) {
  return applyDecorators(
    opts.nullable
      ? IsOptional()
      : IsNotEmpty({
          message: 'This field is required',
        }),
    ApiProperty({ type: String, example: 'Any text' }),
    ApiResponseProperty({ type: String, example: 'Any text' }),
    Column({ type: 'enum', nullable: true, ...opts }),
  );
}

export function Float(opts: ColumnOptions = {}) {
  return applyDecorators(
    opts.nullable
      ? IsOptional()
      : IsNotEmpty({
          message: 'This field is required',
        }),
    ApiProperty({ type: Number, example: 20.5 }),
    ApiResponseProperty({ type: Number, example: 20.5 }),
    Column({ type: 'float', nullable: true, ...opts }),
  );
}
