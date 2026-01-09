import { Body, Controller, Param, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  AppDel,
  AppGet,
  AppPost,
  AppPut,
  Claim,
  GuardAccessControl,
} from '@app/decorators/app.decorator';
import { User } from './models/entities/user.entity';
import { Pagination } from '@app/decorators/pagination.decorator';
import { AppRequest, PaginatedParams } from '@app/interfaces/index.type';
import { CreateUserDto } from './common/dtos/create-user.dto';
import { UpdateUserCombineDto } from './common/dtos/update-user.dto';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AppGet('', {
    paginated: true,
    summary: 'Get all users',
    responseType: User,
  })
  @Claim('read:user')
  async getUsers(@Pagination() pagination: PaginatedParams) {
    const result = await this.userService.getUsers(pagination);
    return result;
  }

  @AppGet(':id', {
    paginated: false,
    summary: 'Get specific user',
    responseType: User,
  })
  @Claim('read:user')
  async getUser(@Param('id') id: string) {
    const result = await this.userService.getUser(id);
    return result;
  }

  @AppPost('register', {
    summary: 'Register user',
  })
  async registerOrgUser(@Body() dto: CreateUserDto) {
    const result = await this.userService.registerUser(dto);
    return result;
  }

  @AppPut('update', {
    summary: 'Update user',
  })
  @GuardAccessControl()
  async updateUser(
    @Body() dto: UpdateUserCombineDto,
    @Request() req: AppRequest,
  ) {
    const result = await this.userService.updateUser(req.user.sub, dto);
    return result;
  }

  @AppDel(':id', {
    summary: 'Delete specific user by id',
    responseType: User,
  })
  async deleteUser(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);
    return result;
  }
}
