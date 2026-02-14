import { Module } from '@nestjs/common';
import { ProductTypeQueueProvider } from './queue/index.provider';
import { ProductTypeCacheProvider } from './cache/index.provider';
import { ProductTypeJobsProvider } from './jobs/index.provider';

@Module({
  imports: [],
  providers: [
    ProductTypeQueueProvider,
    ProductTypeCacheProvider,
    ProductTypeJobsProvider,
  ],
  exports: [
    ProductTypeQueueProvider,
    ProductTypeCacheProvider,
    ProductTypeJobsProvider,
  ],
})
export class ProductTypeProviderModule {}
