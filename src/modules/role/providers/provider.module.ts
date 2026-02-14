import { Module } from '@nestjs/common';
import { RoleQueueProvider } from './queue/index.provider';
import { RoleCacheProvider } from './cache/index.provider';
import { RoleJobsProvider } from './jobs/index.provider';

@Module({
  imports: [],
  providers: [RoleQueueProvider, RoleCacheProvider, RoleJobsProvider],
  exports: [RoleQueueProvider, RoleCacheProvider, RoleJobsProvider],
})
export class RoleProviderModule {}
