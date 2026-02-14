import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseAppEntity } from '@app/db/base/base.entity';
import { Product } from './product.entity';
import { MediaFile } from '@app/modules/file/models/entities/file.entity';

export enum ProductMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum ProductMediaRole {
  THUMBNAIL = 'THUMBNAIL',
  GALLERY = 'GALLERY',
  VIDEO = 'VIDEO',
}

@Entity({ name: 'product_media' })
@Index(['product', 'order'])
export class ProductMedia extends BaseAppEntity {
  @ManyToOne(() => Product, (p) => p.media, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => MediaFile, (f) => f.productLinks, {
    eager: true, // biar langsung ke-include di response
    onDelete: 'CASCADE',
  })
  file: MediaFile;

  @Column({
    type: 'enum',
    enum: ProductMediaType,
    default: ProductMediaType.IMAGE,
  })
  type: ProductMediaType;

  @Column({
    type: 'enum',
    enum: ProductMediaRole,
    default: ProductMediaRole.GALLERY,
  })
  role: ProductMediaRole;

  @Column({ type: 'int', default: 0 })
  order: number;
}
