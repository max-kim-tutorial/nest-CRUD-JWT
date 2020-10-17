import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Post from 'src/models/post.entity';

@Module({
  // @InjectRepository 사용했다고 모듈에게 알려주기
  // repository도 있으니 connection이나 entityManager도 데코레이터로 사용할 수 있겠네
  // 이런식으로 표시해주면 알아서 dependency를 해결한다
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}