import { Injectable } from '@nestjs/common';
import { FindManyOptions, Not, Repository } from 'typeorm';
import { User } from './models/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppCountedResult } from '@app/interfaces/index.type';
import { withTransaction } from '@app/utils/db.util';
import { v4 } from 'uuid';
import { CreateUserDto } from './common/dtos/create-user.dto';
import { Role } from '../role/models/entities/role.entity';
import { RoleHasPermission } from '../role/models/entities/role-has-permission.entity';
import { RolePermission } from '../role/models/entities/role-permission.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import * as _ from 'lodash';
import { UpdateUserCombineDto } from './common/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,

    private readonly authService: AuthService,
  ) {}

  async getUsers(opts: FindManyOptions<User>): AppCountedResult<User> {
    const result = await this.userRepository.findAndCount({
      ...opts,
      relations: {
        image: true,
        role: true,
      },
      where: {
        ...opts.where,
      },
    });

    return result;
  }

  getUser(id: string): Promise<User> {
    return this.userRepository.findOne({
      relations: {
        image: true,
        role: true,
      },
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

        let role: Role;
        if (!dto.role) {
          role = new Role();
          role.name = `super_admin`;
          role.description = `Super admin role for ${dto.email}, with this role you can manage all the data`;
          role.icon = `🔥`;

          const rp = await this.rolePermissionRepository.find({
            where: {
              feature: Not('*'),
            },
          });

          // it's a super admin, so we need to give all permission
          const roleHasPermission = rp.map((item) => {
            const rhp = new RoleHasPermission();
            rhp.id = v4();
            rhp.permission = item;
            rhp.role = role;
            return rhp;
          });

          await manager.save(Role, role);
          await manager.save(RoleHasPermission, roleHasPermission);
        } else {
          role = { id: dto.role?.id } as Role;
        }

        user.id = v4();
        user.name = dto.name;
        user.email = dto.email;
        user.phone = dto.phone;
        user.image = dto.image;
        const newPass = await bcrypt.hash(dto.password, 10);
        user.passwordHash = newPass;
        user.role = role;

        await manager.save(User, user);

        const token = this.authService.authLib.signUserToken({
          email: user.email,
          role: {
            sub: role.id,
          },
          sub: user.id,
        });

        return {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
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
      relations: {
        image: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update only the fields that are not null
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
