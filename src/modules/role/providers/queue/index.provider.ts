import { Injectable } from '@nestjs/common';

/**
 * Role Queue Provider
 * this class is used to provide queue for role module, you can utilize this class
 * to create queue for role module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class RoleQueueProvider
 */
@Injectable()
export class RoleQueueProvider {}
