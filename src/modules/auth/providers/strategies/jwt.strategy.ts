import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AppJwtPayload } from '@app/interfaces/index.type';
import { AppUtils } from '@app/utils/index.util';
import { readFileSync } from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: readFileSync(
        AppUtils.joinCwd('keys', 'jwtPrivkey.pem'),
        'utf8',
      ),
    });
  }

  public validate(payload: AppJwtPayload): AppJwtPayload | never {
    if (!payload.sub) {
      throw new UnauthorizedException(
        "You're not authorized to access this resource.",
      );
    }

    return payload;
  }
}
