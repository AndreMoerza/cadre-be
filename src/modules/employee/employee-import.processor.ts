import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { Employee } from './models/entities/employee.entity';

@Processor('employee-import')
export class EmployeeImportProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepo: Repository<Employee>,
    ) {
        super();
    }

    async process(job: Job<any>): Promise<any> {
        switch (job.name) {
            case 'import-csv':
                return this.handleImport(job);

            default:
                console.warn(`Unknown job ${job.name}`);
        }
    }

    private async handleImport(job: Job<{ filePath: string }>) {
        const { filePath } = job.data;

        const BATCH_SIZE = 500;
        const employeesBatch: Partial<Employee>[] = [];

        let processed = 0;
        const estimated = 20000;

        const stream = fs.createReadStream(filePath);

        const csvStream = csv
            .parse({ headers: true })
            .on('data', async (row) => {
                employeesBatch.push({
                    name: row.name,
                    age: Number(row.age),
                    position: row.position,
                    salary: Number(row.salary),
                });

                if (employeesBatch.length >= BATCH_SIZE) {
                    csvStream.pause();

                    await this.employeeRepo
                        .createQueryBuilder()
                        .insert()
                        .into(Employee)
                        .values(employeesBatch)
                        .execute();

                    processed += employeesBatch.length;
                    employeesBatch.length = 0;

                    const progress = Math.min(100, Math.round((processed / estimated) * 100));
                    await job.updateProgress(progress);

                    csvStream.resume();
                }
            })
            .on('end', async () => {
                if (employeesBatch.length > 0) {
                    await this.employeeRepo
                        .createQueryBuilder()
                        .insert()
                        .into(Employee)
                        .values(employeesBatch)
                        .execute();
                }

                await job.updateProgress(100);

                fs.unlink(filePath, () => null);
            });

        stream.pipe(csvStream);
    }
}
