import { TimeEntity } from '@app/db/base/base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { RoleHasPermission } from './role-has-permission.entity';

@Entity('role_permission')
export class RolePermission extends TimeEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Permission ID should be unique, and it is required.',
  })
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  action: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  feature: string;

  @OneToMany(
    () => RoleHasPermission,
    (roleHasPermission) => roleHasPermission.permission,
  )
  roleHasPermissions: RoleHasPermission[];

  @BeforeInsert()
  async setPermissionId() {
    this.id = `${this.feature}:${this.action}`;
  }
}
