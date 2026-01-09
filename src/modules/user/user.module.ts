import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { UserProviderModule } from './common/providers/provider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserProviderModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule { }
