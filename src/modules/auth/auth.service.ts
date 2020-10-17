import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // export된거 여기다가 쓴다
  constructor(
    private userService: UserService,
    private jwtService:JwtService
    ) {}

  // 패스포트 로컬 스토리지에서 이걸 쓸것이다
  // 패스워드 일치 여부 확인하는 pass라는 파라미터를 쓴다
  // 당연한 이야기지만 실제 앱에서는 패스워드 bycrypt해야된다
  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // jwt에 들어갈 정보 고르기
    const payload = { username: user.username, sub: user.userId };
    // 해당 정보 + credential로 jwt 토큰 발행
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}