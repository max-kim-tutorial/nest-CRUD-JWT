# Nest-CRUD-JWT

Nest.js로 구현하는 CRUD(게시판 앱) + JWT 인증

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

## 모듈

모듈은 @module 데코레이터로 어노테이트한다. 이 데코레이터는 어플리케이션의 구조를 만들 수 있도록 메타데이터를 제공하는 역할을 한다.

모듈은 계층 구조를 이루고 있고, 각 앱은 하나의 root module이 있다. 이 모듈은 어플리케이션 그래프를 만들어낼 진입점을 잡아준다. 아주 작은 앱들은 이론적으로 하나의 진입점, 하나의 모듈만을 필요로 하겠지만, 여러가지 모듈들을 사용하고 연관된 capability의 모음으로 캡슐화 하는것이 보통이다. @module이 인자에서 갖는 객체는 providers, controllers, imports, exports가 있다.

- imports : 임포트된 모듈들의 리스트이고, 이 리스트의 모듈들은 데코레이터에서 사용중인 모듈에서 필요한 providers를 export하고 있어야 한다.
- exports: providers의 하위 집합으로 데코레이터를 사용중인 모듈이 제공받은 provider의 일부를 내보낸다.

### 기능 모듈

- 컨트롤러와 그 컨트롤러에서 쓰이는 서비스 클래스는 같은 어플리케이션 영역으로 서로 연관이 깊기 때문에 묶을 수 있다. 
- 이렇게 관심사로 묶고 조직적으로 유지하는 것은 개발하는데 복잡성을 줄여준다.

```ts
// 관심사가 같은 것끼리 하나의 모듈로 묶는다
// cats/cats.module.ts

import {Module} from "@nestjs/common";
import {CatsController} from "./cats.controller";
import {CatsService} from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService]
})
export class CatsModule {}
```

- 묶은 모듈은 진입점에서, imports로 등록한다.

```ts
// app.module.ts

import {Module} from "@nestjs/common";
import {CatsModule} from "./cats/cats.module";

@Module({
    imports: [CatsModule]
})
export class AppModule{}

// 디렉토리 구조
src/
    cats/
        dto/
            create-cat.dto.ts
        interfaces/
            cat.interface.ts
        cats.service.ts
        cats.controller.ts
        cats.module.ts
    app.module.ts
    main.ts
```

### 공유 모듈

- Nest에서 모듈들은 기본적으로 싱글톤이고, 그렇기 때문에 어떠한 provider의 인스턴스든 여러 모듈에서 **동일한 인스턴스를** 공유할 수 있다.
- 아래와 같이 하면 Catsmodule을 임포트하는 어떤 모듈에서든 CatsService를 사용할 수 있다.

```ts
// cats.module.ts

// 해당 모듈에서 provider로 선언한 모듈을 다른 모듈에서도 쓰고싶다면?
import {Module} from "@nestjs/common";
import {CatsController} from "./cats.controller";
import {CatsService} from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService],
    // 다른 모듈에서 쓸 수 있도록 export 배열에 추가한다.
    exports: [CatsService]
})
export class CatsModule {}
```

### 다시 내보내기

- 모듈은 import 해온 것을 export할 수 있다 의존성 주입하는 방식으로 가능하다.
- 모듈 클래스 자체는 프로바이더

```ts
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```


### 의존성 주입

- export되는 모듈의 constructor에 import한 모듈의 의존성을 주입할 수 있다.
- 클래스 모듈 자체는 순환참조 문제때문에 안된다.
- 네스트에서는 순환참조 문제가 모듈과 프로바이더 사이에서 발생할 수 있다. forwardRef라는 유틸함수를 써서 해결할 수 있다. 아직 정의되지 않은 클래스를 reference하게 해주는 함수임.

```ts
// cats.module.ts
import {Module} from "@nestjs/common";
import {CatsController} from "./cats.controller";
import {CatsService} from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService]
})
export class CatsModule {
    constructor(private catsService: CatsService) {}
}
```

### 글로벌 모듈

- Nest에서는 프로바이더들을 전역 범위가 아닌 **모듈 스코프** 안에서 캡슐화 한다. 앞서 캡슐화된 모듈들을 임포트하지 않는다면, 모듈의 provider을 사용할 수 없다.
- 그래서 @global() 데코레이터를 통해 전역 모듈을 선언해줄 수 있다.
- 글로벌 모듈은 앱 시작할때 딱 한번 register되고 루트나 코어 모듈을 통해서 generate된다. 
- 글로벌 모듈은 import 배열에 모듈을 선언하지 않아도 사용할 수 있게 된다.
- 물론 필요할때만 쓰는게 좋겠다

```ts
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

### 동적 모듈

- 커스텀 가능한, 일종의 추상 클래스를 만들 수 있다.
- 커스텀 가능한 모듈은 provider을 동적으로 설정하고 등록할 수 있게 해준다.

```ts
import {Module, DynamicModule} from "@nestjs/common";
import {createDatabaseProviders} from "./database.providers";
import {Connection} from "./connection.provider";

@Module({
    // 커넥션 모듈
    providers: [Connection]
})
export class DatabaseModule {
    // 정적 메소드 => 다이나믹 모듈을 리턴함
    // 인자에 따라서 추가적인 프로바이더를 리턴할 수 있게 된다
    // 오버라이드되는것이 아니고 기본 module 메타데이터에서 extend된다.
    // 요 모듈에서는 데이터베이스의 connection과 repository가 동적으로 리턴된다.
    static forRoot(entities = [], options?): DynamicModule {
        const providers = createDatabaseProviders(options, entities);
        return {
            module: DatabaseModule,
            providers,
            exports: providers
        }
    }
}
```

메인 모듈에서는 이런식으로 설정된다.

```ts
import {Module} from "@nestjs/common"
import {DatabaseModule} from "./database/database.module";
import {User} from "./users/entities/user.entity";

@Module({
    imports: [DatabaseModule.forRoot([User])]
})
export class AppModule{}
```

## 미들웨어

컨트롤러 바로 전(정확히는 라우터 핸들러 바로 전)에서 동작하는 함수. 미들웨어 함수들은 애플리케이션의 req, res에 접근 가능하고 next() 미들웨어 함수에 접근할 수 있음. express랑 똑같네.

요청과 응답에 변화를 줄 수 있고 사이클을 끝낼 수도 있으며 next미들웨어를 불러 다음으로 넘어갈 수도 있다. 

Nest에서 미들웨어는 함수이거나 injectable 데코레이터로 선언한 클래스이다(즉 프로바이더임). 클래스의 경우에는 일반적으로 미들웨어 인터페이스를 implement해야 함. 함수일때는 딱히 뭐 없음.

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request...');
    next();
  }
}
```

### 의존성 주입

- Nest미들웨어는 온전하게 의존성 주입을 지원한다. Provider나 Controller처럼 같은 모듈에서 사용할 수 있는 의존성을 주입하는것이 가능.
- 주로 constructor에 접근하여 이루어진다.

### 미들웨어 적용하기

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})

export class AppModule implements NestModule {
  // configure메소드에 consumer 타입 지정
  configure(consumer: MiddlewareConsumer) {
    // 이런식으로 apply
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
```

- 모듈 클래스에 configure()메소드를 사용하여 미들웨어를 집어넣는다. 
- NestModule 인터페이스가 필요하다. 
- 미들웨어를 달 라우터 핸들러를 지정할 수 있다 forRoutes로.. 더 구체적으로는 아래와 같이 요청의 종류를 명시할 수도 있다.
- 라우트 path에 와일드카드 사용도 가능하다 `forRoutes({ path: "ab*cd", method: RequestMethod.ALL });`
`

```ts
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer
} from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "cats", method: RequestMethod.GET });
  }
}
```

### 미들웨어 consumer

- 핼퍼클래스. 몇가지 내장된 미들웨어를 관리해주는 메소드를 가지고 있다.
- 다수의 컨트롤러 클래스를 받을 수도 있따. 체인 형태로 적용할 수 있다.

```ts
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CatsModule } from "./cats/cats.module";
import { CatsController } from "./cats/cats.controller";

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
```

### 미들웨어에서 라우터 제외하기

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: "cats", method: RequestMethod.GET },
    { path: "cats", method: RequestMethod.POST },
    "cats/(.*)"
  )
  .forRoutes(CatsController);
```

exclude 체이닝으로 특정 라우트를 쉽게 제외할 수 있다. 하나의 스트링, 다수의 스트링, 또는 제외될 라우팅을 결정해주는 RouteInfo 객체를 받는다.

### 함수형 미들웨어

```ts
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
}
```

간단한 미들웨어는 클래스로 선언할 필요 없이, 멤버도 없고 추가 메서드도 없고 추가적인 의존성도 없다면 함수형으로 미들웨어를 만들 수 있다. express 미들웨어랑 똑같이 생겼다.

### 다수의 미들웨어 적용하기

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

여러 미들웨어를 연속적으로 동작하도록 묶어주기 위해서 쉼표로 분리된 리스트가 apply()메서드 안에 필요하다.

### 글로벌 미들웨어

미들웨어를 등록된 모든 라우터에 한번에 적용하려면 INestApplication 인스턴스에 의해 제공되는 use()메서드를 활용할 수 있다.

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

## Exception Filter

Nest에는 핸들링되지 않은 모든 예외들에 대해 반응하도록 하는 내장된 예외 레이어가 있다. 핸들링되지 않는 예외가 있다면 이 레이어에서 잡아서 자동으로 적절한 응답을 보내준다(ㄷㄷ)

HttpException 타입의 예외를 처리하는 내장된 글로벌 예외 처리기에 의해 동작하는 것으로, 예외가 인식되지 않는 경우에 내장된 예외 처리기가 500 응답을 알아서 보내준다(ㄷㄷ). 에러 핸들러 미들웨어같은걸 달아주지 않아도 된다.

### 표준 예외 스로잉

- Nest는 내장된 HttpException 클래스를 제공한다. 특정한 에러 상황이 발생했을 때 표준 HTTP 응답 객체를 보내는게 가장 좋은 방법. 

```ts
// 컨트롤러 메소드에서 에러 발생시키기
// 두개의 인자값을 요구
@Get()
async findAll() {
  // 문자열 혹은 객체 첫번째 인자
  // 상태코드
    throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
}

// 해당 응답
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

객체를 응답 바디 전체로 덮어 씌울 수 있다 요렇게

```ts
@Get()
async findAll() {
    throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: "Custom Message"
    }, HttpStatus.FORBIDDEN)
}
```

### 커스텀 예외 필터

- 내장된 기본 예외 필터는 자동적으로 많은 경우를 커버하지만, 예외 레이어의 온전한 커스텀 제어를 필요로 할때도 있다. 
- request 오브젝트에서는 오리지널 url과 로깅 정보를 포함하고, response 객체는 직접적인 응답 컨트롤을 위해 사용한다.
- 모든 예외 필터들은 제네릭 인터페이스를 implement 해야 한다. implement 함으로써 catch 메소드를 제공하도록 함.

```ts
// http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from "@nestjs/common";
import { Request, Response } from "express";

// 커스텀 에러 필터
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // implement의 결과물
  // 예외의 타입 지정
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
```

### 필터 바인딩

- 커스텀 에러 필터를 컨트롤러에 묶는다
- useFilter 데코레이터 안에 인스턴스말고 클래스를 넣어줘도 된다. 메모리 사용을 줄여준다고 한다. 싱글톤을 좋아하기 때무네
- 클래스든 메소드든 이 데코레이터는 어디든 쓸 수 있다. 스코프를 달리해서 에러필터의 적용 범위를 설정할 수 있다.

```ts
@Post()
// 역시 데코레이터로 묶는다
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
    throw new ForbiddenException()
}
```

- 글로벌 스코프 필터는 이렇게 설정한다.

```ts
// 직접 루트모듈에 등록하거나
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

@Module({
  provider: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}

// 부트스트랩단에서 넣어주거나 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

bootstrap();
```