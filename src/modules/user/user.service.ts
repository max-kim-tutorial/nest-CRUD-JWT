import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import User from "src/models/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>
  ) {}

  async findOne(username: string) {
    return await this.user.findOne({where:{userName:username}});
  }

  createOne(username:string, password:string) {
    return this.user.create({userName:username, password:password}).save()
  }
}