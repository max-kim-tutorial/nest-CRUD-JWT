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