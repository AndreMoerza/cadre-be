import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseAppEntity } from '@app/db/base/base.entity';
import { Category } from '@app/modules/category/models/entities/category.entity';
import { Brand } from '@app/modules/brand/models/entities/brand.entity';
import { ProductMedia } from './product-media.entity';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity({ name: 'products' })
export class Product extends BaseAppEntity {
  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => Brand, (t) => t.products, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  brand: Brand;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  price!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  salePrice!: string;

  @Column({ type: 'numeric', default: 0 })
  displayStock!: string;

  @Column({ type: 'numeric', default: 0 })
  realStock!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @ManyToOne(() => Category, (t) => t.products, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  category!: Category;

  @OneToMany(() => ProductMedia, (pm) => pm.product, { cascade: true })
  media: ProductMedia[];
}
