import { PostModule } from './modules/post/index';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import User from "./models/user.entity";
import Post from "./models/post.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    // ormconfig도 사용 가능하다
    // 이렇게 연결을 해주면 TypeORM connection과 EntityManager 객체는 전체 프로젝트에서 주입 가능
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Post],
      synchronize: true
    }),
    PostModule
  ],
})
export class AppModule {}
