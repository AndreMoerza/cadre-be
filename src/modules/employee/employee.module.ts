// src/modules/employee/employee.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './models/entities/employee.entity';
import { NotificationsGateway } from './providers/notifications/notifications.gateway';
import { EmployeeImportProcessor } from './employee-import.processor';
import { EmployeeJobsProcessor } from './employee.processor';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/csv',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'employee-jobs' },
      { name: 'employee-import' },
    ),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeJobsProcessor, EmployeeImportProcessor, NotificationsGateway],
})
export class EmployeeModule { }
