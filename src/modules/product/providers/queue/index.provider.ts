import { Injectable } from '@nestjs/common';

/**
 * Product Queue Provider
 * this class is used to provide queue for product module, you can utilize this class
 * to create queue for product module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class ProductQueueProvider
 */
@Injectable()
export class ProductQueueProvider {}
