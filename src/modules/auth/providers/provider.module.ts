import { Module } from '@nestjs/common';
import { AuthQueueProvider } from './queue/index.provider';
import { AuthCacheProvider } from './cache/index.provider';
import { AuthJobsProvider } from './jobs/index.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../models/entities/auth.entity';
import { UserSession } from '@app/modules/user/models/entities/user-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, UserSession])],
  providers: [AuthQueueProvider, AuthCacheProvider, AuthJobsProvider],
  exports: [AuthQueueProvider, AuthCacheProvider, AuthJobsProvider],
})
export class AuthProviderModule {}
