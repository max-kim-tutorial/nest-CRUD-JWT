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

## provider

Nest의 기본적인 컨셉이라고 한다. 네스트의 여러가지 개체들이 provider로 취급된다.  
**의존성을 주입**한다는 컨셉이 골자다. 데코레이터로 하는 간단한 의존성 주입으로 개체들은 서로 쉽게 다양한 관계를 맺을 수 있게 되고, 런타임에 돌아갈 수 있게 된다.

 @Injectable 데코레이터를 사용한다. 컨트롤러에 반복되는 로직이나, 단순하지 않고 조금더 복잡한 컨트롤러 로직을 만드는데 사용되는 거 같다. Nest는 SOLID를 좋아한다는 말을 굳이 하는것으로 보아 **의존성 역전 원칙**을 좋아하는 거 같다.

### Services

컨트롤러에서 서비스 로직을 분리하는 거 

```ts
// cats.service.ts

import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

export interface Cat {
  name: string;
  age: number;
  bread: string;
}

// 얘는 네스트가 프로바이더임을 알 수 있게 메타데이터를 붙여주는 데코레이터
// 주입될 수 있는 서비스 로직이 되는 것이다
@Injectable()
export class CatService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

컨트롤러는 이렇게 됨

```ts
import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreateCatDto } from "./dto/create-cat.dto";
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";

// typeDi같다
@Controller("cats")
export class CatsController {
  // 컨스트럭터에서 멤버변수로 바로 쓸 수 있게 해준다
  constructor(private catsService: CatService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    // 마구 서비스 로직을 사용할 수 있다.
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

### 그래서 의존성 주입

```ts
// constructor 타입 선언으로 바로 인스턴스를 사용할 수 있는 타입스크립트 문법
// 생성자를 사용해 개체를 만들어 줄 필요가 없어진다
// 즉 클래스를 인자로써만 사용 가능한 것이다. 함수 내부에서 만들어서 의존성을 만들 필요가 없어진다.

constructor(private catsService: CatsService) {}
```

### 스코프

- 프로바이더는 어플리케이션의 라이프사이클과 같이 수명을 갖는다. 
- 어플리케이션이 실행되면, 모든 dependency를 nest가 리졸브하고 프로바이더를 쓸 수 있게 된다.
- 어플리케이션이 shut down 되는 경우에도 프로바이더들은 사망한다
- 리퀘스트 범위에서 프로바이더를 죽였다 살렸다 할 수 있는 방법이 있는 것 같다.
- DEFAULT 스코프 : 싱글 인스턴스 프로바이더(싱글톤 - 클래스의 인스턴스는 전체 어플리케이션을 통틀어 단 하나) 프로바이더의 생명주기가 어플리케이션과 같이 이루어진다. 아무런 옵션이 없으면 DEFAULT로 쓰이는것
- REQUEST 스코프 : 프로바이더 인스턴스가 incoming request가 존재할때 생성되고 죽는다. 인스턴스는 리퀘스트가 처리되면 GC된다
- TRANSIENT 스코프 : 프로바이더의 소비자들 사이에서 공유되지 않는 프로바이더들이다. 깊은복사처럼 소비자에게 의존성이 주입될때 생성되므로 각 소비자들마다 각각의 다른 인스턴스가 생성된다.
- 싱글톤을 쓰는게 추천된다. 초기화가 어플리케이션 시작할때 딱 한번만 되는거니까 계속 돌리는 상황에서 캐싱도 되고 그렇고

```ts
// 요런식으로 등록해준다
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

### 선택적 프로바이더

```ts
import { Injectable, Optional, Inject } from "@nestjs/common";

@Injectable()
export class HttpService<T> {
  // 커스텀 토큰??
  constructor(@Optional() @Inject("HTTP_OPTIONS") private httpClient: T) {}
}
```

- 주입하다보면 필요없는 의존성이 있을 수도 있는데 생성자에 optional 데코레이터를 사용한다.
- 저 상황에서는 타입 인자가 들어오지 않으면 default가 사용되는 그런걸가
- 잘 몰게따

### 프로퍼티 기반 주입

```ts
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class HttpService<T> {
  @Inject("HTTP_OPTIONS")
  private readonly httpClient: T;
}
```

- 위에서 계속 썼던 기술은 생성자 기반 주입, 특별한 경우에는 프로퍼티 기반 주입을 사용할 수 있는데 
- 최상위 클래스가 하나 또는 다수의 프로바이더에게 의존성을 가지고 있다면 하위 클래스에서 super을 넘겨주는 것은 그렇게 좋은 방법은 또 아니다. 이러한 경우를 피하기 위해서 @inject 데코레이터를 프로퍼티(멤버변수)에게도 사용할 수 있다.

### 프로바이더 등록

- 아까와 같이 진입점에다가 프로바이더 배열에 등록해준다.
- 디렉토리 나누는 법을 좀 탐구해봐야 할 것 같다.

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```