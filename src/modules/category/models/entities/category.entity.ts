import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseAppEntity } from '@app/db/base/base.entity';
import { Product } from '@app/modules/product/models/entities/product.entity';

@Entity({ name: 'category' })
export class Category extends BaseAppEntity {
  @Index({ unique: true })
  @Column({ type: 'text' })
  code!: string; // e.g., "FOOD", "ELEC"

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @OneToMany(() => Product, (p) => p.category)
  products!: Product[];
}
