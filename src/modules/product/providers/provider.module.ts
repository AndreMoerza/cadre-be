import { Module } from '@nestjs/common';
import { ProductQueueProvider } from './queue/index.provider';
import { ProductCacheProvider } from './cache/index.provider';
import { ProductJobsProvider } from './jobs/index.provider';

@Module({
  imports: [],
  providers: [ProductQueueProvider, ProductCacheProvider, ProductJobsProvider],
  exports: [ProductQueueProvider, ProductCacheProvider, ProductJobsProvider],
})
export class ProductProviderModule {}
