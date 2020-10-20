import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from "./auth.controller"

@Module({
  // 유저모듈 임포트
  imports: [
    UserModule, 
    PassportModule,
    // jwt 모듈의 config 설정을 여기서 해줄 수 있다
    // 이걸 임포트했으니 하위의 JwtService를 모듈에서 사용할 수 있다
    JwtModule.register({secret: 'sdasw23d',}),
  ],
  controllers:[AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})

export class AuthModule {}
