import { Injectable } from "@nestjs/common";
import Post from "src/models/post.entity";
import { EditPostDto } from "./interfaces/dto.interface";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostService {
  // 레포지토리 의존성 주입
  constructor(
    @InjectRepository(Post) private readonly post: Repository<Post>
  ) {}

  createPost(createPostDto: EditPostDto) {
    // TODO: user가 누군지 찾고 유저까지 해서 create
    return this.post.create(createPostDto).save();
  }

  getPostList() {
    return this.post.find({
      select: ["title", "content", "createdAt", "user"],
      order: { createdAt: -1 }
    });
  }

  getPostDetail(id: number) {
    return this.post.findOne(id);
  }
  
  async editPost(id:number, editPostDto: EditPostDto) {
    await this.post.update(id, editPostDto);
  }

  removePost(id: number) {
    return this.post.delete(id);
  }
}