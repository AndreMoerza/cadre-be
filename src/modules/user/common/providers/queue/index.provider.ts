import { Injectable } from '@nestjs/common';

/**
 * User Queue Provider
 * this class is used to provide queue for user module, you can utilize this class
 * to create queue for user module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class UserQueueProvider
 */
@Injectable()
export class UserQueueProvider {}
