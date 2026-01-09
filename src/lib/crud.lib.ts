import { withTransaction } from '@app/utils/db.util';
import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

export class CrudService<T> {
  entity: EntityTarget<T>;
  repository: Repository<T>;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.entity = entity;
    this.repository = dataSource.getRepository(entity);
  }

  getMany(opts: FindManyOptions<T>) {
    return this.repository.find(opts);
  }

  getManyAndCount(opts: FindManyOptions<T>) {
    return this.repository.findAndCount(opts);
  }

  getOne(opts: FindOneOptions<T>) {
    return this.repository.findOne({
      ...opts,
    });
  }

  count(opts: FindManyOptions<T>) {
    return this.repository.count(opts);
  }

  async delete(data: T | T[], useTransaction?: boolean, hardRemove?: boolean) {
    if (useTransaction) {
      return await withTransaction(this.repository)(async (repository) => {
        if (hardRemove) {
          return await repository.remove(data as T);
        }
        return await repository.softRemove(data as T);
      });
    }
    if (hardRemove) {
      return this.repository.remove(data as T);
    }
    return this.repository.softRemove(data as T);
  }

  async createOne(data: T, useTransaction?: boolean) {
    if (useTransaction) {
      return await withTransaction(this.repository)(async (repository) => {
        return await repository.save(data);
      });
    }
    return this.repository.save(data);
  }

  async updateOne(data: T, useTransaction?: boolean) {
    if (useTransaction) {
      return await withTransaction(this.repository)(async (repository) => {
        return await repository.save(data);
      });
    }
    return this.repository.save(data);
  }

  async exists(opts: FindOneOptions<T>) {
    return (await this.repository.count(opts)) > 0;
  }

  async getOneOrFail(opts: FindOneOptions<T>, msg?: string) {
    const result = await this.repository.findOne(opts);
    if (!result) {
      throw new Error(msg || 'Resource not found');
    }
    return result;
  }

  async createMany(data: T[]) {
    return this.repository.save(data);
  }

  async updateMany(data: T[]) {
    return this.repository.save(data);
  }
}
