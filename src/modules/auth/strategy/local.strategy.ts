import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

// strategy를 extend
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // super에서는 default로 지정된 프로퍼티명을 바꿀수 있다
    super();
  }

  // verify method
  // 전략 패턴을 따른다. 메소드명은 정해져있음.
  // how you determine if a user exists and is valid. 아니면 에러발생시키기
  async validate(username: string, password: string): Promise<any> {
    // 맞는지 확인 (단순비교)
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
