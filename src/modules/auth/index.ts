import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  // 쓰는 것들은 다 명시해줘야되네 모듈이든 모듈에서 exports된 것이든
  // 그럼 프로바이더에서는 import해서 썻는데 모듈에서 명시 안하면 에러나려나 그거 어캐잡지
  imports: [UserModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})

export class AuthModule {}