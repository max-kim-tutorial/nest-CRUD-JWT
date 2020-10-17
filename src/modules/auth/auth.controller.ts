import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AppController {
  // 컨트롤러에서 로그인 전략을 연결해주고 컨트롤러 메소드마다 로그인 전략을 명시하는
  // UseGuards 데코레이터, 전략의 이름을 받는다
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}