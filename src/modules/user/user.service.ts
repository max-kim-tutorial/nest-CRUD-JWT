import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import User from "src/models/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>
  ) {}

  async findOne(username: string) {
    return this.user.find({where:{username}});
  }
}