import { Module } from '@nestjs/common';
import { BrandQueueProvider } from './queue/index.provider';
import { BrandCacheProvider } from './cache/index.provider';
import { BrandJobsProvider } from './jobs/index.provider';

@Module({
  imports: [],
  providers: [BrandQueueProvider, BrandCacheProvider, BrandJobsProvider],
  exports: [BrandQueueProvider, BrandCacheProvider, BrandJobsProvider],
})
export class BrandProviderModule {}
