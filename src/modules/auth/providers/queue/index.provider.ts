import { OnWorkerEvent, Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { AuthQueue } from '../../common/constants/index.constant';
import { Job } from 'bullmq';
import { AuthQueueTrackSessionData } from '../../common/interfaces/index.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../../models/entities/auth.entity';
import { Repository } from 'typeorm';
import { UserSession } from '@app/modules/user/models/entities/user-session.entity';
import { v4 } from 'uuid';
import { BaseQueue } from '@app/base/queue.base';

/**
 * Auth Queue Provider
 * this class is used to provide queue for auth module, you can utilize this class
 * to create queue for auth module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class AuthQueueProvider
 */
@Injectable()
@Processor(AuthQueue.TRACK_SESSION)
export class AuthQueueProvider extends BaseQueue<AuthQueueTrackSessionData> {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {
    super(AuthQueueProvider.name);
  }

  @OnWorkerEvent('progress')
  async onProgress(job: Job<AuthQueueTrackSessionData>) {
    this.log(`Processing job ${job.id} -- ${job.name}`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<AuthQueueTrackSessionData>) {
    this.logError(`Failed job ${job.id} -- ${job.name}`);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<AuthQueueTrackSessionData>) {
    this.log(`Completed job ${job.id} -- ${job.name}`);
  }

  async process(job: Job<AuthQueueTrackSessionData>) {
    const userSession = new UserSession();
    userSession.id = v4();
    userSession.agent = job.data?.dto?.deviceInfo?.deviceType || null;
    userSession.deviceType = job.data?.dto?.deviceInfo?.deviceType || null;

    const auth = new Auth();
    auth.id = job.data.authData.id;
    Object.assign(auth, job.data.authData);

    await this.userSessionRepository.save(userSession);

    auth.userSession = userSession;
    await this.authRepository.save(auth);

    return job.data;
  }
}
