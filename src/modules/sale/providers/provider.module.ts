import { Module } from '@nestjs/common';
import { SaleQueueProvider } from './queue/index.provider';
import { SaleCacheProvider } from './cache/index.provider';
import { SaleJobsProvider } from './jobs/index.provider';

@Module({
  imports: [],
  providers: [SaleQueueProvider, SaleCacheProvider, SaleJobsProvider],
  exports: [SaleQueueProvider, SaleCacheProvider, SaleJobsProvider],
})
export class SaleProviderModule {}
