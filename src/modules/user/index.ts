import { UserService } from './user.service';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from 'src/models/user.entity';

//! user 모듈에는 컨트롤러는 없고 서비스만 익스포트한다
//! user 릴레이션과 소통하는 로직들만 있는 거
//! 이거 가지고와서 auth 모듈에 쓸것
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}