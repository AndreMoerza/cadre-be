import { BaseAppEntity } from '@app/db/base/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';

@Entity('role_has_permission')
export class RoleHasPermission extends BaseAppEntity {
  @ManyToOne(() => Role, (role) => role.id, { nullable: false })
  role: Role;

  @ManyToOne(() => RolePermission, (role) => role.id, { nullable: false })
  permission: RolePermission;
}
