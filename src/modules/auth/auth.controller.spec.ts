import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorizeDto } from './common/dtos/authorize.dto';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: jest.Mocked<AuthService>;

    beforeEach(async () => {
        const authServiceMock: Partial<Record<keyof AuthService, jest.Mock>> = {
            authorize: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceMock,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get(AuthService) as jest.Mocked<AuthService>;

        jest.clearAllMocks();
    });

    describe('authorizeUser', () => {
        it('should call authService.authorize with dto and return its result', async () => {
            const dto: AuthorizeDto = {
                email: 'user@example.com',
                password: 'secret123',
            } as any;

            const fakeResult = {
                accessToken: 'fake-token',
                user: { id: 'user-1', email: dto.email },
            };

            authService.authorize.mockResolvedValue(fakeResult as any);

            const result = await controller.authorizeUser(dto);

            expect(authService.authorize).toHaveBeenCalledTimes(1);
            expect(authService.authorize).toHaveBeenCalledWith(dto);
            expect(result).toBe(fakeResult);
        });
    });
});
