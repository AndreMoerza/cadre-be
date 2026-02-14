import { User } from '@app/modules/user/models/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';
import * as bcrypt from 'bcrypt';
import { Role } from '@app/modules/role/models/entities/role.entity';

@Injectable()
export class UserFactory {
  rep: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.rep = this.dataSource.getRepository(User);
  }

  async run() {
    try {
      const plainUser = [
        {
          id: '472dbea5-dc9b-4996-99e5-59cd07297a2c',
          name: `admin`,
          email: `andre.moerza@mail.com`,
          phone: `+1234567890`,
        },
      ] as QueryDeepPartialEntity<User>[];

      const newPass = await bcrypt.hash('admin123', 10);

      const users = plainUser.map((user) => {
        const ety = new User();
        ety.id = user.id as string;
        ety.name = user.name as string;
        ety.email = user.email as string;
        ety.phone = user.phone as string;
        ety.passwordHash = newPass;
        ety.role = { id: '1582e5ee-af4e-4fd0-ad50-9d0e5f9aa911' } as Role;
        return ety;
      });

      await this.rep.save(users);
    } catch (error) {
      throw new Error(error);
    }
  }
}
