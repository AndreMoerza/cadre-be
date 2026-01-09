import { AppRequest, Permission } from '@app/interfaces/index.type';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../auth.service';

@Injectable()
export class AccessControl implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const claimedPermission =
      this.reflector.get('permission', context.getHandler()) || [];
    const [req] = context.getArgs() as [AppRequest];
    const [action, feature] = claimedPermission as string[];

    if (!req.user)
      throw new UnauthorizedException(
        `You are not authorized to access this resource, please login first`,
      );
    if (!action || !feature) return true;


    return true;
  }
}
