import { Module } from '@nestjs/common';
import { EmployeeQueueProvider } from './queue/index.provider';
import { EmployeeCacheProvider } from './cache/index.provider';
import { EmployeeJobsProvider } from './jobs/index.provider';

@Module({
  imports: [],
  providers: [EmployeeQueueProvider, EmployeeCacheProvider, EmployeeJobsProvider],
  exports: [EmployeeQueueProvider, EmployeeCacheProvider, EmployeeJobsProvider],
})
export class EmployeeProviderModule {}
