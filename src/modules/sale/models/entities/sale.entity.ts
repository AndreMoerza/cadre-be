import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseAppEntity } from '@app/db/base/base.entity';
import { User } from '@app/modules/user/models/entities/user.entity';
import { SaleItem } from './sale-item.entity';

export enum SaleStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'sales' })
export class Sale extends BaseAppEntity {
  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  cashier!: User;

  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.DRAFT })
  status!: SaleStatus;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  subtotal!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  discountTotal!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  taxTotal!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  grandTotal!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  paidAmount!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  dueAmount!: string;

  @OneToMany(() => SaleItem, (i) => i.sale, { cascade: true })
  items!: SaleItem[];
}
