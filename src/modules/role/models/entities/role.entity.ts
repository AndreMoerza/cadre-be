// this entity file is the typeorm entity, you can add your own fields here
import { BaseAppEntity } from '@app/db/base/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('role')
export class Role extends BaseAppEntity {
  @Index({
    unique: true,
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
    comment:
      'Role name should be unique, and it is required. e.g: {$tenant_slug}_super_admin | {$tenant_slug}_user | {$tenant_slug}_tenant_admin',
  })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  icon: string;
}
