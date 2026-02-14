import { Injectable } from '@nestjs/common';

/**
 * Sale Queue Provider
 * this class is used to provide queue for sale module, you can utilize this class
 * to create queue for sale module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class SaleQueueProvider
 */
@Injectable()
export class SaleQueueProvider {}
