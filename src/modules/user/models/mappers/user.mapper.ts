import { User } from '../entities/user.entity';

export class UserMapper {
  static toEntity(user: User) {
    return {
      id: user.id,
    };
  }
}
