// this entity file is the typeorm entity, you can add your own fields here
import { BaseAppEntity } from '@app/db/base/base.entity';
import { ProductMedia } from '@app/modules/product/models/entities/product-media.entity';
import { User } from '@app/modules/user/models/entities/user.entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('file')
export class MediaFile extends BaseAppEntity {
  @Column('text', { nullable: false })
  @ApiResponseProperty({
    example: 'my-image.png',
  })
  name: string;

  @Column('varchar', { nullable: true, length: 100 })
  @ApiResponseProperty({
    example: 'image/png',
  })
  mimeType: string;

  @Column('text', { nullable: false })
  @ApiResponseProperty({
    example: 'https://my-bucket.s3.amazonaws.com/my-image.png',
  })
  path: string;

  @Column('text', { nullable: true })
  key: string;

  @Column('varchar', { nullable: true, length: 255 })
  bucket: string;

  @Column('boolean', { nullable: false, default: false })
  private: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @ApiResponseProperty({
    type: () => User,
  })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.id)
  @ApiResponseProperty({
    type: () => User,
  })
  updatedBy: User;

  @OneToMany(() => ProductMedia, (pm) => pm.file)
  productLinks: ProductMedia[];
}
