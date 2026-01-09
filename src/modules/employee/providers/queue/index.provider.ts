import { Injectable } from '@nestjs/common';

/**
 * Employee Queue Provider
 * this class is used to provide queue for employee module, you can utilize this class
 * to create queue for employee module e.g. sending email, sending sms, cron job queue, scheduling queue, etc.
 * @export
 * @class EmployeeQueueProvider
 */
@Injectable()
export class EmployeeQueueProvider {}
