import { PaginatedParams } from '@app/interfaces/index.type';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ILike } from 'typeorm';

export const Pagination = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): PaginatedParams => {
    const request = ctx.switchToHttp().getRequest();
    const {
      page = 0,
      limit = 50,
      sort,
      search,
      populate,
    } = request.query as {
      page: number;
      limit: number;
      sort?: string;
      search?: string;
      populate?: string;
    };

    let newSorts = {};
    let newSearch = {};
    const relations = [];
    if (sort) {
      sort.split(',').forEach((sort: string) => {
        const [field, order] = sort.split(':');
        newSorts = { ...newSorts, [field]: order };
      });
    }
    if (search) {
      const multiSearches = search.split(',');
      if (multiSearches.length > 1) {
        newSearch = multiSearches.map((s) => {
          const [field, value] = s.split(':');
          const hasPercent = (value || '')?.includes('%');
          return {
            [field]: !hasPercent ? value : ILike(value),
          };
        });
      } else {
        const [field, value] = search.split(':');
        const hasPercent = (value || '')?.includes('%');
        newSearch = {
          [field]: !hasPercent ? value : ILike(value),
        };
      }
    }
    if (populate) {
      populate.split(',').forEach((field: string) => {
        relations.push(field);
      });
    }

    const getSkip = () => {
      return (Number(page) - 1) * Number(limit) || 0;
    };

    return {
      skip: getSkip(),
      take: Number(limit),
      order: newSorts,
      where: newSearch,
      relations,
    };
  },
);
