import { Module } from '@nestjs/common';
import { FileQueueProvider } from './queue/index.provider';
import { FileCacheProvider } from './cache/index.provider';
import { FileJobsProvider } from './jobs/index.provider';

@Module({
  imports: [],
  providers: [FileQueueProvider, FileCacheProvider, FileJobsProvider],
  exports: [FileQueueProvider, FileCacheProvider, FileJobsProvider],
})
export class FileProviderModule {}
