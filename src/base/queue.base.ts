import { WorkerHost } from '@nestjs/bullmq';
import { PinoLogger } from 'nestjs-pino';
import { Worker } from 'bullmq';
import { AppUtils } from '@app/utils/index.util';

export abstract class BaseQueue<T = any, R = any> extends WorkerHost<
  Worker<T, R>
> {
  logger: PinoLogger;

  constructor(name: string) {
    super();
    this.logger = new PinoLogger({
      pinoHttp: {
        name: name,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            destination: 1,
            levelFirst: true,
            colorize: true,
            sync: false,
            append: true, // the file is opened with the 'a' flag
            mkdir: true, // create the target destination
          },
        },
        autoLogging: false,
        msgPrefix: `Queue:${name}`,
      },
      renameContext: 'queue',
    });
  }

  protected log(msg: string, ...args: any[]) {
    const str = AppUtils.formatLog(...args);
    this.logger.info(msg, str);
  }

  protected logError(msg: string, ...args: any[]) {
    const str = AppUtils.formatLog(...args);
    this.logger.error(msg, str);
  }
}
