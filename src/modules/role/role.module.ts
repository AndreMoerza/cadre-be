import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleProviderModule } from './providers/provider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      /** import your entities here. */
    ]),
    RoleProviderModule,
  ],
  providers: [RoleService],
  exports: [],
  controllers: [RoleController],
})
export class RoleModule {}
