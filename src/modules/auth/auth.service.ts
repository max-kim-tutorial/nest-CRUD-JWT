import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import User from "../../models/user.entity"
// TODO: 여기다가 유저 검증, 토큰 발급, 토큰 검증
@Injectable()
export class AuthService {
  // export된거 여기다가 쓴다
  constructor(
    private userService: UserService,
    private jwtService:JwtService
  ) {}


  // TODO: bycrypt
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  validateTokenExpired(token:string) {
    return this.jwtService.verify(token)
  }

  decodeToken(token:string):Object {
    return this.jwtService.decode(token)
  }

  issueAccessToken(user:User) {
    const payload = { 
      id: user.id,
      username: user.userName, 
      type:'access'
    };
    return this.jwtService.sign(payload, { expiresIn: '60s' })
  }

  issueRefreshToken(user:User) {
    const payload = { 
      id: user.id,
      username: user.userName, 
      type:'refresh'
    };
    return this.jwtService.sign(payload, { expiresIn: '200s' })
  }
}