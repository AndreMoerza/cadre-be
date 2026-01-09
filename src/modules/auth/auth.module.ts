import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProviderModule } from './providers/provider.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationConfig } from '@app/interfaces/config.type';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user/models/entities/user.entity';
import { Auth } from './models/entities/auth.entity';
import { UserSession } from '../user/models/entities/user-session.entity';
import { JwtStrategy } from './providers/strategies/jwt.strategy';
import { BullModule } from '@nestjs/bullmq';
import { AuthQueue } from './common/constants/index.constant';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSession,
      Auth,
    ]),
    BullModule.registerQueue({
      name: AuthQueue.TRACK_SESSION,
    }),
    AuthProviderModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ApplicationConfig>) => ({
        signOptions: {
          expiresIn: configService.getOrThrow('app.jwtExpires', {
            infer: true,
          }),
        },
      }),
    }),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
