import { BaseAppEntity } from '@app/db/base/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Role } from '@app/modules/role/models/entities/role.entity';
import * as bcrypt from 'bcrypt';
@Entity({ name: 'users' })
export class User extends BaseAppEntity {
  @Column({ type: 'text' })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'citext' })
  email!: string;

  @Column({ type: 'text' })
  passwordHash!: string;

  @Column({ type: 'text', nullable: true })
  phone?: string | null;

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;

  validateUserPassword(passwordInput: string) {
    if (!passwordInput) {
      return false;
    }
    return bcrypt.compare(passwordInput, this.passwordHash);
  }
}
