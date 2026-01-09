import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class InternalEntity extends BaseEntity {
  __entity?: string;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

export class TimeEntity extends InternalEntity {
  @ApiResponseProperty({
    example: new Date().toISOString(),
    type: 'string',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @ApiResponseProperty({
    example: new Date().toISOString(),
    type: 'string',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @ApiResponseProperty({
    example: new Date().toISOString(),
    type: 'string',
  })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}

export class BaseAppEntity extends TimeEntity {
  @ApiResponseProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    type: 'string',
  })
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    type: 'string',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export class CommonEntity extends BaseAppEntity {
  @ApiResponseProperty({
    example: 'Item name',
    type: 'string',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ApiResponseProperty({
    example: 'Item description',
    type: 'string',
  })
  @Column({ type: 'longtext', nullable: true })
  description: string;
}
