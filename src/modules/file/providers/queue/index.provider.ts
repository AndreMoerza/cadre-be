import { Injectable } from '@nestjs/common';

/**
 * File Queue Provider
 * this class is used to provide queue for file module, you can utilize this class
 * to create queue for file module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class FileQueueProvider
 */
@Injectable()
export class FileQueueProvider {}
