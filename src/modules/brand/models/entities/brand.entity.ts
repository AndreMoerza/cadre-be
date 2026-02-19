// this entity file is the typeorm entity, you can add your own fields here
import { BaseAppEntity } from '@app/db/base/base.entity';
import { MediaFile } from '@app/modules/file/models/entities/file.entity';
import { Product } from '@app/modules/product/models/entities/product.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
@Entity('brands')
export class Brand extends BaseAppEntity {
  @Index({ unique: true })
  @Column({ type: 'text' })
  code!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @ManyToOne(() => MediaFile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'imageId' })
  image?: MediaFile;

  @OneToMany(() => Product, (p) => p.brand)
  products: Product[];
}
