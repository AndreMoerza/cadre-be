import {
  Body,
  Controller,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { AppDel, AppGet, AppPost, AppPut } from '@app/decorators/app.decorator';
import { Pagination } from '@app/decorators/pagination.decorator';
import { PaginatedParams } from '@app/interfaces/index.type';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { CreateEmployeeDto } from './common/dtos/create-employee.dto';
import { Employee } from './models/entities/employee.entity';
import { UpdateEmployeeDto } from './common/dtos/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './common/dtos/upload-file.dto';
import { API_CONSUMES } from '@app/constants/app.constant';

@ApiTags()
@Controller({
  path: 'employee',
  version: '1',
})
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    @InjectQueue('employee-jobs')
    private readonly employeeJobsQueue: Queue,
    @InjectQueue('employee-import')
    private readonly employeeImportQueue: Queue,
  ) {}

  @AppPost('', {
    summary: 'Register employee',
  })
  async create(@Body() dto: CreateEmployeeDto) {
    const employee = await this.employeeService.create(dto);

    await this.employeeJobsQueue.add('employee-created', {
      employeeId: employee.id,
    });

    return employee;
  }

  @AppGet('', {
    paginated: true,
    summary: 'Get all employee',
    responseType: Employee,
  })
  async findAll(@Pagination() pagination: PaginatedParams) {
    return this.employeeService.findAll(pagination);
  }

  @AppGet(':id', {
    paginated: true,
    summary: 'Get specific user',
    responseType: Employee,
  })
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @AppPut(':id', {
    summary: 'Update employee',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  @AppDel(':id', {
    summary: 'Delete specific employee by id',
    responseType: Employee,
  })
  async remove(@Param('id') id: string) {
    await this.employeeService.remove(id);
    return { success: true };
  }

  @AppPost('import', {
    summary: 'Import employee via CSV',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes(API_CONSUMES.FORM_DATA)
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body() _: UploadFileDto,
  ) {
    const job = await this.employeeImportQueue.add('import-csv', {
      filePath: file.path,
    });

    return {
      jobId: job.id,
      message: 'File diterima, proses import berjalan di background',
    };
  }

  @AppGet('import/:jobId/progress', {
    summary: 'Get import CSV progress',
  })
  async getImportProgress(@Param('jobId') jobId: string) {
    const job = await this.employeeImportQueue.getJob(jobId);

    if (!job) {
      return {
        jobId,
        status: 'not_found',
        progress: 0,
      };
    }

    const state = await job.getState();
    const rawProgress = job.progress;

    const progress =
      typeof rawProgress === 'number'
        ? rawProgress
        : typeof rawProgress === 'object' &&
            rawProgress !== null &&
            'value' in rawProgress
          ? Number((rawProgress as any).value) || 0
          : 0;

    return {
      jobId,
      status: state,
      progress,
      ...(state === 'completed' ? { result: job.returnvalue } : {}),
      ...(state === 'failed' ? { failedReason: job.failedReason } : {}),
    };
  }
}
