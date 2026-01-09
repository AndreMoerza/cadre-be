// this entity file is the typeorm entity, you can add your own fields here
import { BaseAppEntity } from '@app/db/base/base.entity';
import { UserSession } from '@app/modules/user/models/entities/user-session.entity';
import { User } from '@app/modules/user/models/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity('auth')
export class Auth extends BaseAppEntity {
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;

  @ManyToOne(() => UserSession, (userSession) => userSession.id, {
    nullable: true,
  })
  userSession: UserSession;

  @Column({ type: Boolean, nullable: false, default: false })
  isBlocked: boolean;

  @Column({ type: Date, nullable: true })
  blockedAt: Date;

  @Column({ type: Date, nullable: true })
  unBlockedAt: Date;

  @Column({ type: Boolean, nullable: false, default: false })
  isLoggedIn: boolean;

  @Column({ type: 'int', nullable: false, default: 0 })
  loginRetries: number;
}
