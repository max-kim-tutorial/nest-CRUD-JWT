import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Post from 'src/models/post.entity';

@Module({
  // 데이터베이스 모듈 import했다고 선언해주기
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}