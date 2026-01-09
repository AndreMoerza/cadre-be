import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AppPost } from '@app/decorators/app.decorator';
import { AuthorizeDto } from './common/dtos/authorize.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AppPost('user/login', {
    summary: 'Authorize user',
    paginated: false,
  })
  async authorizeUser(@Body() dto: AuthorizeDto) {
    return this.authService.authorize(dto);
  }
}
