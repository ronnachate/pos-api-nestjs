import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { STRATEGY_JWT_REFRESH } from '../constant/strategy';
import { SigninUserDTO } from '../dtos/signin.user.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_REFRESH
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('jwt.secretKey'),
    });
  }

  async validate(payload: any): Promise<SigninUserDTO> {
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
