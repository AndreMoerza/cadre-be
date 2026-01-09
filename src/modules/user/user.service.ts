import { Injectable } from '@nestjs/common';
import { FindManyOptions, Not, Repository } from 'typeorm';
import { User } from './models/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppCountedResult } from '@app/interfaces/index.type';
import { withTransaction } from '@app/utils/db.util';
import { v4 } from 'uuid';
import { CreateUserDto } from './common/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import * as _ from 'lodash';
import { UpdateUserCombineDto } from './common/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly authService: AuthService,
  ) { }

  async getUsers(opts: FindManyOptions<User>): AppCountedResult<User> {
    const result = await this.userRepository.findAndCount({
      ...opts,
      where: {
        ...opts.where,
      },
    });

    return result;
  }

  getUser(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async registerUser(dto: CreateUserDto) {
    const userIsExists = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (userIsExists) {
      throw new Error(
        `User with email ${dto.email} already exists, please use another email`,
      );
    }

    const user = await withTransaction(this.userRepository)(
      async ({ manager }) => {
        const user = new User();

        user.id = v4();
        user.name = dto.name;
        user.email = dto.email;
        user.phone = dto.phone;
        const newPass = await bcrypt.hash(dto.password, 10);
        user.passwordHash = newPass;

        await manager.save(User, user);

        const token = this.authService.authLib.signUserToken({
          email: user.email,
          sub: user.id,
        });

        return {
          user: {
            id: user.id,
            email: user.email,
            token,
            ..._.omit(user),
          },
        };
      },
    );

    return user;
  }

  async updateUser(id: string, dto: UpdateUserCombineDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    for (const key in dto.user) {
      if (dto.user[key] !== null && dto.user[key] !== undefined) {
        if (key === 'password' && dto[key] !== null && dto[key] !== undefined) {
          const newPass = await bcrypt.hash(dto.user.password, 10);
          user.passwordHash = newPass;
        } else {
          user[key] = dto.user[key];
        }
      }
    }

    return await withTransaction(this.userRepository)(async ({ manager }) => {
      await manager.save(User, user);
      return user;
    });
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await withTransaction(this.userRepository)(async ({ manager }) => {
      await manager.softRemove(User, user);
      return user;
    });
  }
}
