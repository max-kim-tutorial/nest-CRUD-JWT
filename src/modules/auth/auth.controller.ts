import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}
  // 컨트롤러에서 로그인 전략을 연결해주고 컨트롤러 메소드마다 로그인 전략을 명시하는
  // UseGuards 데코레이터, 전략의 이름을 받는다
  // 어캐찾는거지??
  // 전략을 실행한 후 => req 인자로 넣어주면 => jwt 토큰 발행
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // 발행된 토큰을 인자로 받고 => jwt 전략 실행후 => 유저 리턴
  // 토큰이 만료되었다면 401을 알아서 뿜어준다
  // 그럼 저거 일일히 다 달아줘야되는 건가? 아마도 그럴듯 
  // Authguard만 분리시키는것도 괜찮은 선택 
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}