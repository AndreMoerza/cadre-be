import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseAppEntity } from '@app/db/base/base.entity';
import { Sale } from './sale.entity';
import { Product } from '@app/modules/product/models/entities/product.entity';

@Entity({ name: 'sale_items' })
export class SaleItem extends BaseAppEntity {
  @ManyToOne(() => Sale, (s) => s.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  sale!: Sale;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })
  product!: Product;

  @Column({ type: 'numeric', precision: 14, scale: 3 })
  quantity!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  unitPrice!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  discount!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  lineTotal!: string; // (qty * unitPrice) - discount
}
