import { Injectable } from '@nestjs/common';
/**
 * Auth Jobs Provider
 * this class is used to provide jobs for auth module, you can utilize this class
 * to create jobs for auth module e.g. sending email, sending sms, cron job, scheduling, etc.
 * @export
 * @class AuthJobsProvider
 */
@Injectable()
export class AuthJobsProvider {}
