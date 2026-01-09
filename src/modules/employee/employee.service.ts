import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Employee } from './models/entities/employee.entity';
import { CreateEmployeeDto } from './common/dtos/create-employee.dto';
import { UpdateEmployeeDto } from './common/dtos/update-employee.dto';
import { AppCountedResult } from '@app/interfaces/index.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) { }

  private buildFindAllCacheKey(opts: FindManyOptions<Employee>): string {
    const { skip, take, where, order } = opts ?? {};
    return (
      'employee:list:' +
      JSON.stringify({
        skip: skip ?? 0,
        take: take ?? 10,
        where: where ?? {},
        order: order ?? {},
      })
    );
  }

  private buildFindOneCacheKey(id: string): string {
    return `employee:detail:${id}`;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepo.create(dto);
    return this.employeeRepo.save(employee);
  }

  async findAll(
    opts: FindManyOptions<Employee>,
  ): Promise<AppCountedResult<Employee>> {
    const cacheKey = this.buildFindAllCacheKey(opts);
    const cached = (await this.cache.get<AppCountedResult<Employee>>(
      cacheKey
    )) as unknown as AppCountedResult<Employee> | null;

    if (cached) {
      return cached;
    }

    const result = await this.employeeRepo.findAndCount({
      ...opts,
      where: {
        ...opts.where,
      },
    });

    await this.cache.set(cacheKey, result, 60);

    return result;
  }

  async findOne(id: string): Promise<Employee> {
    const cacheKey = this.buildFindOneCacheKey(id);

    const cached = (await this.cache.get<Employee>(cacheKey)) as
      | Employee
      | null;
    if (cached) {
      return cached;
    }

    const employee = await this.employeeRepo.findOne({
      where: { id },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    await this.cache.set(cacheKey, employee, 60 * 5);

    return employee;
  }

  async invalidateEmployeeCache(id?: string) {
    if (id) {
      await this.cache.del(this.buildFindOneCacheKey(id));
    }
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return this.employeeRepo.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepo.remove(employee);
  }
}
