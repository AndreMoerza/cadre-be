import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmployeeService } from './employee.service';
import { NotificationsGateway } from './providers/notifications/notifications.gateway';

@Processor('employee-jobs')
export class EmployeeJobsProcessor extends WorkerHost {
    constructor(
        private readonly employeeService: EmployeeService,
        private readonly notificationsGateway: NotificationsGateway,
    ) {
        super();
    }

    async process(job: Job<any>): Promise<any> {
        switch (job.name) {
            case 'employee-created':
                return this.handleEmployeeCreated(job);

            default:
                console.warn(`Unknown job ${job.name}`);
        }
    }

    private async handleEmployeeCreated(job: Job<{ employeeId: string }>) {
        const employee = await this.employeeService.findOne(job.data.employeeId);

        this.notificationsGateway.notifyEmployeeCreated({
            employeeId: employee.id,
            name: employee.name,
        });

        return true;
    }
}
