1. nest g mo user
2. nest g co user
```js
  import { Controller, Post } from '@nestjs/common';

  @Controller('user')
  export class UserController {
    @Post('register')   // 注册
    async register(){
      return `register`
    }
    @Post('login')   // 登录
    async login(){
      return `login`
    }
  }
```
3. nest g s user
  ```js
  import { Injectable } from '@nestjs/common';

  @Injectable()
  export class UserService {
    async register(registerBodyDto) {
      return {
        code: 200,
        msg: 'Success',
      };
    }
  }
  ```
4. 在对应控制器内注入服务
   ```js
    import { Controller, Post } from '@nestjs/common';
    import { UserService } from './user.service';

    @Controller('user')
    export class UserController {
      constructor(
        private readonly userServer:UserService
      ){

      }
      @Post('register')   // 注册
      async register(){
        return this.userServer.register('test')
      }
      @Post('login')   // 登录
      async login(){
        return `login`
      }
    }
   ```
   5. 创建DTO nest g class user/dto/user.dto --no-spec
   ```js
   export class UserDto {}

    export class registerBodyDto {
      readonly username:string;
      readonly password:string;
      readonly nickname:string;
      readonly repassword:string;
      readonly mobile:number;
      readonly role? :string | number
    }
   ```
   6. 使用DTO user.controller.ts
   ```js
    import { Body, Controller, Post } from '@nestjs/common';
    import { registerBodyDto } from './dto/user.dto';
    import { UserService } from './user.service';

    @Controller('user')
    export class UserController {
      constructor(
        private readonly userServer:UserService
      ){

      }
      @Post('register')   // 注册
      async register(@Body() registerBody:registerBodyDto){
        return this.userServer.register(registerBody)
      }
      @Post('login')   // 登录
      async login(){
        return `login`
      }
    }
    ```
    user.service.ts
    ```js
    import { Injectable } from '@nestjs/common';
    import { registerBodyDto } from './dto/user.dto';

    @Injectable()
    export class UserService {
      async register(registerBodyDto:registerBodyDto) {
        return {
          code: 200,
          msg: 'Success',
        };
      }
    }
    ```
  7. 添加参数校验 npm i class-validator class-transformer
  ```js
    // main.ts
    import { ValidationPipe } from '@nestjs/common';
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.useGlobalPipes(new ValidationPipe({
        whitelist:false, // 设置参数白名单，未在DTO中声明的字段将被过滤
        forbidNonWhitelisted:false, //若参数中有未在DTO中存在的字段，终止请求
        transform:true // 将请求参数(字符串、数组)转换为DTO需要的格式
      }))
      await app.listen(3000);
    }
    bootstrap();
  ```
  ```js
  // user.dto.ts
  import { IsNumber, IsString } from "class-validator";

  export class UserDto {}

  export class registerBodyDto {
    @IsString()
    readonly username:string;
    @IsString()
    readonly password:string;
    @IsString()
    readonly nickname:string;
    @IsString()
    readonly repassword:string;
    @IsNumber()
    readonly mobile:number;
    readonly role? :string | number
  }
  ```

  8. 链接数据库 npm install @nestjs/typeorm typeorm mysql2 -S
  ```js
  // app.module.ts
  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { UserModule } from './user/user.module';

  @Module({
    imports: [UserModule,TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost',
      port:3306,
      username:'root',
      password:'12345678',
      database:'chart_app',
      autoLoadEntities:true, // 自动加载模块，而不是指定实体数组
      synchronize:true // TypeORM实体每次运行应用程序时自动同步数据库，生产环境需要关闭。
    })],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ```
