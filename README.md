# Nest-CRUD-JWT

Nest.js로 구현하는 CRUD + JWT 인증

## 보일러플레이트 구조

> **보일러플레이트**
main.ts : 앱의 진입점
app.module.ts : 앱의 루트 모듈
app.controller.ts : 앱의 컨트롤러

## controller

오는 요청을 받고 클라이언트에게 응답을 주는 부분. class와 데코레이터를 이용해서 만든다.

### 라우팅

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

- @controller()를 사용해서 컨트롤러를 지정한다. 데코레이터를 통해 연관된 라우터를 그룹짓는다.
- 위 코드는 라우트 패스 접두사를 cats로 정의한 것 (GET /cats)
- @Get()은 Nest에게 HTTP request들의 엔드포인트들을 구체적으로 지정하는 역할을 함. 문자열을 넣으면 서브엔드포인트로 라우팅 가능해짐
- express처럼 res.json을 사용하지 않고 내장된 메서드를 통해 응답을 만든다. 객체나 배열로 리턴하면 JSON으로 시리얼라이징한다. @HttpCode를 붙여주면 응답 코드를 바꿀 수 있다.
- express처럼 할 수는 있다. 이때는 인자에 res를 등록해야한다. response에 full control을 준다는 점에서는 괜찮지만 네스트에서는 별로 추천하지 않음.
- 네스트에서는 데코레이터를 통해 메소드 하나하나의 간단하고 명징성을 추구하는거 같음. 데코레이터로 표현할 수 있으면 하지 굳이 메서드에서? 이런 늒임

```ts
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
     res.status(HttpStatus.OK).json([]);
  }
}
```

### 요청 객체

```ts
import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

// 엔드포인트
@Controller("cats")
export class CatsController {
  // 메소드
  @Get()
  // 리퀘스트 파라미터(@body이런것도 파라미터에다가 하는거가틈)
  findAll(@Req() request: Request): string {
    return "This action returns all cats";
  }
```

- Nest는 Request 객체에 접근하는 방식을 마찬가지로 데코레이터로 제공한다. Default인 Request 객체는 Express 객체를 따른다.
- 타입스크립트에서는 파라미터에도 데코레이터를 지정할 수 있다
- Express의 request 객체를 사용하지만 Express처럼 직접 query나 body를 꺼내오지 않고 이것 역시 @Body(), @Query() 이런식으로 사용한다. 파라미터에서 정의한다 => 사용할 리소스를 깔끔하게 정리해주는듯
- 이외에도 커스텀 데코레이터 API가 있는듯 하다

### 리소스

```ts
import { Controller, Get, Post } from "@nestjs/common";

@Controller("cats")
export class CatsController {
  @Post()
  // 요런 함수이름은 걍 지정한건가
  create(): string {
    return "This action adds a new cat";
  }

  @Get()
  findAll(): string {
    return "This action returns all cats";
  }
}
```

- Nest는 일반적인 HTTP request 엔드포인트 데코레이터를 제공한다. @Post, @Put, @Delete..
- @All을 쓰면 모든 메소드를 핸들하는 로직도 만들 수 있다

### 패턴기반 라우팅

```ts
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

- ?, +, *의 reg 기호들을 사용해서 라우팅을 표현할 수 있다. 

### 응답코드

```ts
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

- 200이 기본이고 post는 201이 기본
- @HttpCode() 데코레이터로 지정 가능

### 리다이렉트

```ts
@Get("docs")
// 기본값 302
@Redirect("https://docs.nestjs.com", 302)
getDocs(@Query("version") version) {
    if (version && version === "7") {
        return {url: "https://docs.nestjs.com/v5/"};
    }
}
```

- 메서드에서 리턴하는 값으로 리다이렉

### 파라미터 라우팅

```ts
// :으로 파라미터 넣어주기
@Get(':id')
findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
}
```

### 서브도메인 라우팅

```ts
// 호스트로 들어오는 요청 명시
@Controller({ host: ":account.example.com" })
export class AccountController {
  @Get()
  // 호스트파람 추출
  getInfo(@HostParam("account") account: string) {
    return account;
  }
}
```

### 비동기성

```ts
@Get()
async findAll(): Promise<any[]> {
    return []
}
```

- Nest가 스스로 resolve할수있는 프로미스 값을 전달할 수 있다
- 이래놓고 요청들어오면 어캐대지 => nest itself가 리졸브한다고 한다
- 근데 응답 보내줘야되는 상황에서 굳이 그렇게?? 만약에 서버에서 요청날릴일 있으면 async안에서 하고 프로미스 리턴하거나 아니면 걍 오브젝트 리턴하거나

### request payload

```ts
// interface로도 할수있긴 한데
// 컴파일 과정에서 삭제되기 때문에 런타임에서는 참조할 수 없다
export class CreateCatDto {
    readonly name: string;
    readonly age: number;
    readonly breed: string;
}

@Post()
async create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
}
```

- POST요청에서 바디에서 들어오는 payload의 타입을 맞춰줄 수 있다
- Data Transfer Object는 클래스로 정의해야한다.

### 컨트롤러 등록

이렇게 컨트롤러를 만들어 보면 요런 꼴이 나온다.

```ts
// 메소드 이름은 임의이ㅡ 이름
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete
} from "@nestjs/common";
// Post 요청의 타입
import { CreateCatDto, UpdateCatDto, ListAllEntities } from "./dto";

@Controller("cats")
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return "This action adds a new cat";
  }

  // 쿼리타입지정
  // 반환값은 따로 타입지정 안해도 되나
  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return `This action removes a #${id} cat`;
  }
}
```

컨트롤러는 항상 module에 속한다. @module데코레이터 안에 controllers array가 있는 것

```ts
import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";

// AppMoudle 클래스 데코레이터의 인자
@Module({
  controllers: [CatsController]
})
export class AppModule {}
```