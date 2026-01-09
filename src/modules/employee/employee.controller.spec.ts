import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { PaginatedParams } from '@app/interfaces/index.type';
import { CreateEmployeeDto } from './common/dtos/create-employee.dto';
import { UpdateEmployeeDto } from './common/dtos/update-employee.dto';
import { Employee } from './models/entities/employee.entity';

describe('EmployeeController', () => {
    let controller: EmployeeController;
    let employeeService: jest.Mocked<EmployeeService>;
    let employeeJobsQueue: jest.Mocked<Queue>;
    let employeeImportQueue: jest.Mocked<Queue>;

    beforeEach(async () => {
        const employeeServiceMock: Partial<
            Record<keyof EmployeeService, jest.Mock>
        > = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const queueMock: Partial<jest.Mocked<Queue>> = {
            add: jest.fn(),
            getJob: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmployeeController],
            providers: [
                {
                    provide: EmployeeService,
                    useValue: employeeServiceMock,
                },
                {
                    provide: getQueueToken('employee-jobs'),
                    useValue: { ...queueMock },
                },
                {
                    provide: getQueueToken('employee-import'),
                    useValue: { ...queueMock },
                },
            ],
        }).compile();

        controller = module.get<EmployeeController>(EmployeeController);
        employeeService = module.get(EmployeeService) as jest.Mocked<EmployeeService>;
        employeeJobsQueue = module.get(getQueueToken('employee-jobs'));
        employeeImportQueue = module.get(getQueueToken('employee-import'));

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create an employee and enqueue employee-created job', async () => {
            const dto: CreateEmployeeDto = {
                name: 'Asep',
                age: 30,
                position: 'Developer',
                salary: 1000000,
            } as any;

            const createdEmployee: Employee = {
                id: 'emp-1',
                name: 'Asep',
                age: 30,
                position: 'Developer',
                salary: 1000000 as any,
            } as any;

            employeeService.create.mockResolvedValue(createdEmployee);
            (employeeJobsQueue.add as jest.Mock).mockResolvedValue(undefined);

            const result = await controller.create(dto);

            expect(employeeService.create).toHaveBeenCalledWith(dto);
            expect(employeeJobsQueue.add).toHaveBeenCalledWith('employee-created', {
                employeeId: createdEmployee.id,
            });
            expect(result).toBe(createdEmployee);
        });
    });

    describe('findAll', () => {
        it('should call employeeService.findAll with pagination and return result', async () => {
            const pagination: PaginatedParams = {
                skip: 0,
                take: 10,
                order: {},
                where: {},
                relations: [],
            };
            const employees: Employee[] = [
                { id: '1', name: 'Asep', age: 30, position: 'Dev', salary: 1000 as any } as any,
            ];
            const total = 1;
            employeeService.findAll.mockResolvedValue([employees, total] as any);

            const result = await controller.findAll(pagination);

            expect(employeeService.findAll).toHaveBeenCalledWith(pagination);
            expect(result).toEqual([employees, total]);
        });
    });

    describe('findOne', () => {
        it('should call employeeService.findOne with id and return employee', async () => {
            const employee: Employee = {
                id: 'emp-1',
                name: 'Asep',
                age: 30,
                position: 'Dev',
                salary: 1000 as any,
            } as any;

            employeeService.findOne.mockResolvedValue(employee);

            const result = await controller.findOne('emp-1');

            expect(employeeService.findOne).toHaveBeenCalledWith('emp-1');
            expect(result).toBe(employee);
        });
    });

    describe('update', () => {
        it('should call employeeService.update and return updated employee', async () => {
            const dto: UpdateEmployeeDto = {
                name: 'Updated',
                age: 32,
                position: 'Lead',
                salary: 2000,
            } as any;
            const updated: Employee = {
                id: 'emp-1',
                name: 'Updated',
                age: 32,
                position: 'Lead',
                salary: 2000 as any,
            } as any;

            employeeService.update.mockResolvedValue(updated);

            const result = await controller.update('emp-1', dto);

            expect(employeeService.update).toHaveBeenCalledWith('emp-1', dto);
            expect(result).toBe(updated);
        });
    });

    describe('remove', () => {
        it('should call employeeService.remove and return success', async () => {
            employeeService.remove.mockResolvedValue(undefined as any);

            const result = await controller.remove('emp-1');

            expect(employeeService.remove).toHaveBeenCalledWith('emp-1');
            expect(result).toEqual({ success: true });
        });
    });

    describe('importCsv', () => {
        it('should enqueue import-csv job and return job info', async () => {
            const file = { path: '/tmp/employees.csv' } as Express.Multer.File;
            const job = { id: 'job-123' } as any;

            (employeeImportQueue.add as jest.Mock).mockResolvedValue(job);

            const result = await controller.importCsv(file, {} as any);

            expect(employeeImportQueue.add).toHaveBeenCalledWith('import-csv', {
                filePath: file.path,
            });
            expect(result).toEqual({
                jobId: 'job-123',
                message: 'File diterima, proses import berjalan di background',
            });
        });
    });

    describe('getImportProgress', () => {
        it('should return not_found when job does not exist', async () => {
            (employeeImportQueue.getJob as jest.Mock).mockResolvedValue(null);

            const result = await controller.getImportProgress('job-123');

            expect(employeeImportQueue.getJob).toHaveBeenCalledWith('job-123');
            expect(result).toEqual({
                jobId: 'job-123',
                status: 'not_found',
                progress: 0,
            });
        });

        it('should return progress and state for numeric progress', async () => {
            const jobMock: any = {
                id: 'job-123',
                progress: 40,
                getState: jest.fn().mockResolvedValue('active'),
                returnvalue: { total: 10 },
                failedReason: null,
            };
            (employeeImportQueue.getJob as jest.Mock).mockResolvedValue(jobMock);

            const result = await controller.getImportProgress('job-123');

            expect(employeeImportQueue.getJob).toHaveBeenCalledWith('job-123');
            expect(jobMock.getState).toHaveBeenCalled();
            expect(result).toEqual({
                jobId: 'job-123',
                status: 'active',
                progress: 40,
            });
        });

        it('should handle object progress with value field', async () => {
            const jobMock: any = {
                id: 'job-456',
                progress: { value: '75' },
                getState: jest.fn().mockResolvedValue('completed'),
                returnvalue: { total: 20 },
                failedReason: null,
            };
            (employeeImportQueue.getJob as jest.Mock).mockResolvedValue(jobMock);

            const result = await controller.getImportProgress('job-456');

            expect(employeeImportQueue.getJob).toHaveBeenCalledWith('job-456');
            expect(jobMock.getState).toHaveBeenCalled();
            expect(result).toEqual({
                jobId: 'job-456',
                status: 'completed',
                progress: 75,
                result: jobMock.returnvalue,
            });
        });

        it('should include failedReason when state is failed', async () => {
            const jobMock: any = {
                id: 'job-789',
                progress: 10,
                getState: jest.fn().mockResolvedValue('failed'),
                returnvalue: null,
                failedReason: 'Something went wrong',
            };
            (employeeImportQueue.getJob as jest.Mock).mockResolvedValue(jobMock);

            const result = await controller.getImportProgress('job-789');

            expect(employeeImportQueue.getJob).toHaveBeenCalledWith('job-789');
            expect(jobMock.getState).toHaveBeenCalled();
            expect(result).toEqual({
                jobId: 'job-789',
                status: 'failed',
                progress: 10,
                failedReason: 'Something went wrong',
            });
        });
    });
});
