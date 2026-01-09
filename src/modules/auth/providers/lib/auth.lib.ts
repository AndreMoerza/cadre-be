import { AppUtils } from '@app/utils/index.util';
import { readFileSync } from 'fs';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AppUser } from '@app/interfaces/index.type';

export class AuthLib {
  jwtService: JwtService;
  alg: JwtSignOptions['algorithm'] = 'RS256';

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  getSecretKey() {
    return readFileSync(AppUtils.joinCwd('keys', 'jwtPrivkey.pem'), 'utf8');
  }

  signUserToken(payload: AppUser) {
    return this.jwtService.sign(payload, {
      algorithm: this.alg,
      secret: this.getSecretKey(),
      expiresIn: '30d',
    });
  }
}
