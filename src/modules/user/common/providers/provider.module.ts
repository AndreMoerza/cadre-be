import { Module } from '@nestjs/common';
import { UserQueueProvider } from './queue/index.provider';
import { UserCacheProvider } from './cache/index.provider';
import { UserJobsProvider } from './jobs/index.provider';

@Module({
  imports: [],
  providers: [UserQueueProvider, UserCacheProvider, UserJobsProvider],
  exports: [UserQueueProvider, UserCacheProvider, UserJobsProvider],
})
export class UserProviderModule {}
