import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { GuardAccessControl } from '@app/decorators/app.decorator';

@ApiTags()
@Controller({
  path: 'role',
  version: '1',
})
@GuardAccessControl()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
}
