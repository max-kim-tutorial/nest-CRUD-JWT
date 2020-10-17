// src/modules/todo/todo.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete
} from "@nestjs/common";
import { EditPostDto } from "./interfaces/dto.interface";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto:EditPostDto ) {
    // TODO : jwt 토큰 파싱 후 unathorized 에러처리
    const ret = await this.postService.createPost(createPostDto);
    return ret;
  }

  @Get()
  async getList() {
    const ret = await this.postService.getPostList();
    return ret;
  }

  @Get(":id")
  async getOne(@Param("id") postId: number) {
    const ret = await this.postService.getPostDetail(postId);
    return ret;
  }

  @Put(":id")
  async editPost(@Param("id") postId: number, @Body() editPostDto:EditPostDto ) {
    const ret = await this.postService.editPost(postId, editPostDto);
    return ret;
  }

  @Delete(":id")
  async removePost(@Param("id") postId: number) {
    const ret = await this.postService.removePost(postId);
    return ret;
  }
}