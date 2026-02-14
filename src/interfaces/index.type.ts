import { ACTIONS, FEATURES } from '@app/constants/permissions.constant';
import { Request } from 'express';

export interface AppResponse<T> {
  status: number;
  message: string;
  data: T[] | T;
  total?: number;
  pagination?: {
    total?: number;
    limit?: number;
    currentPage?: number;
    nextPage?: number;
  };
}

export type AppCountedResult<T> = Promise<[T[], number]>;

export type PaginatedParams = {
  skip: number;
  take: number;
  order: { [field: string]: 'ASC' | 'DESC' };
  where: { [field: string]: string | any };
  relations: string[];
};

export interface AppGetOpts<T = any> {
  paginated?:
    | boolean
    | {
        page?: boolean;
        limit?: boolean;
        search?: boolean;
        sort?: boolean;
        populate?: boolean;
      };
  responseType?: T;
  summary?: string;
  auth?: boolean;
}

export interface AppPostOpts<T = any> {
  paginated?:
    | boolean
    | {
        page?: boolean;
        limit?: boolean;
        search?: boolean;
        sort?: boolean;
        populate?: boolean;
      };
  responseType?: T;
  summary?: string;
  statusCode?: number;
  auth?: boolean;
}

export interface AppUser {
  sub: string;
  email: string;
  role: { sub: string };
}

export type AppRequest = Request & { user: AppUser };

export type AppJwtPayload = {
  iat: number;
  exp: number;
} & AppUser;

export type UnionOfArrayElements<ARR_T extends Readonly<unknown[]>> =
  ARR_T[number];

export type Permission =
  `${(typeof ACTIONS)[keyof typeof ACTIONS]}:${(typeof FEATURES)[keyof typeof FEATURES]}`;
