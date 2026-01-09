import { Module } from '@nestjs/common';
import { UserFactory } from './user.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/modules/user/models/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserFactory],
  exports: [UserFactory],
})
export class UserFactoryModule { }
