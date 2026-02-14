import { Entity, Column, Index, ManyToOne } from 'typeorm';
import { BaseAppEntity } from '@app/db/base/base.entity';
import { ProductType } from '@app/modules/productType/models/entities/productType.entity';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity({ name: 'products' })
@Index(['sku'], { unique: true })
export class Product extends BaseAppEntity {
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  sku!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  price!: string; // keep money precise as string in JS

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @ManyToOne(() => ProductType, (t) => t.products, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  type!: ProductType;
}
