import { BaseAppEntity } from '@app/db/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'employees' })
export class Employee extends BaseAppEntity {
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'int' })
  age!: number;

  @Column({ type: 'text' })
  position!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  salary!: number;
}