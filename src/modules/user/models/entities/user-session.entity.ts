import { BaseAppEntity } from '@app/db/base/base.entity';
import { Auth } from '@app/modules/auth/models/entities/auth.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('user_session')
export class UserSession extends BaseAppEntity {
  @Column({ type: 'text', nullable: true })
  agent?: string;

  @Column({ type: 'text', nullable: true })
  deviceType?: string;

  @OneToMany(() => Auth, (auth) => auth.userSession)
  auths: Auth[];
}
