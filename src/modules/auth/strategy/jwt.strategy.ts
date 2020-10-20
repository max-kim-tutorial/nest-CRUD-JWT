import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'sdasw23d'
    });
  }

  // JWT를 자동으로 파싱해서 넣어준다!!
  async validate(payload: any):Promise<any> {
    const user = await this.authService.validateUserByToken(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {user, payload};
  }
}