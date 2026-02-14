import { Injectable } from '@nestjs/common';

/**
 * Brand Queue Provider
 * this class is used to provide queue for brand module, you can utilize this class
 * to create queue for brand module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class BrandQueueProvider
 */
@Injectable()
export class BrandQueueProvider {}
