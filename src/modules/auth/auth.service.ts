import { Injectable } from '@nestjs/common';
import { AuthorizeDto } from './common/dtos/authorize.dto';
import { CrudService } from '@app/lib/crud.lib';
import { Auth } from './models/entities/auth.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthLib } from './providers/lib/auth.lib';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/models/entities/user.entity';
import * as _ from 'lodash';
import { withTransaction } from '@app/utils/db.util';
import { v4 } from 'uuid';
import { InjectQueue } from '@nestjs/bullmq';
import {
  AuthQueue,
  AuthQueueConsumer,
} from './common/constants/index.constant';
import { Queue } from 'bullmq';
import { AuthQueueTrackSessionData } from './common/interfaces/index.type';

@Injectable()
export class AuthService extends CrudService<Auth> {
  authLib: AuthLib;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectQueue(AuthQueue.TRACK_SESSION)
    private readonly trackSessionQueue: Queue<AuthQueueTrackSessionData>,

    dataSource: DataSource,
    jwtService: JwtService,
  ) {
    super(Auth, dataSource);
    this.authLib = new AuthLib(jwtService);
  }

  async authorize(dto: AuthorizeDto) {
    return await withTransaction(this.authRepository)(async ({ manager }) => {
      const user = await this.userRepository.findOne({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new Error('User not found, please provide a valid email address');
      }

      let auth = await this.authRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
        },
        relations: {
          user: true,
          userSession: true,
        },
      });

      if (
        auth &&
        auth?.isBlocked &&
        auth?.loginRetries >= 3 &&
        new Date().getTime() < new Date(auth?.unBlockedAt).getTime()
      ) {
        throw new Error(
          'Your account has been blocked by retrying 3 times in row, please try again after 10 minutes',
        );
      }

      if (
        auth &&
        auth?.isBlocked &&
        Boolean(auth?.unBlockedAt) &&
        new Date().getTime() > new Date(auth?.unBlockedAt).getTime()
      ) {
        auth.isBlocked = false;
        auth.loginRetries = 0;
        auth.unBlockedAt = null;
        auth.blockedAt = null;
        await manager.save(Auth, auth);
      }

      const isPasswordValid = user.validateUserPassword(dto.password);
      if (!isPasswordValid) {
        if (auth?.loginRetries >= 3) {
          auth.isBlocked = true;
          auth.blockedAt = new Date();
          auth.unBlockedAt = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes
          await manager.save(Auth, auth);
          throw new Error(
            'Your account has been blocked, please contact support',
          );
        }
        auth.user = user;
        auth.isBlocked = auth?.isBlocked || false;
        auth.isLoggedIn = auth?.isLoggedIn || false;
        auth.loginRetries = (auth?.loginRetries || 0) + 1;
        await manager.save(Auth, auth);
        throw new Error('Your password is incorrect, please try again');
      }

      if (!auth) {
        auth = new Auth();
        auth.id = v4();
        auth.user = user;
        auth.isLoggedIn = true;
        auth.loginRetries = 0;
      }

      const token = this.authLib.signUserToken({
        email: user.email,
        sub: user.id,
      });

      this.trackSessionQueue.add(AuthQueueConsumer.TRACK_SESSION, {
        dto,
        authData: auth.toJSON(),
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          ..._.omit(user),
        },
      };
    });
  }
}
