import { Injectable } from '@nestjs/common';

/**
 * ProductType Queue Provider
 * this class is used to provide queue for productType module, you can utilize this class
 * to create queue for productType module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class ProductTypeQueueProvider
 */
@Injectable()
export class ProductTypeQueueProvider {}
