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
    @IsString()
    readonly mobile:string;
    readonly role? :string
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
  9. 配置Entity实体类 新建 src/user/entites/user.entity.ts
  ```js
  import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

  @Entity()
  export class User {
    // 主键
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    nickname: string;
    @Column()
    repassword: string;
    @Column()
    mobile: string;
    @Column({default:0})
    role: string
  }
  ```
  10. 将实体类引入到对应的Module中
  ```js
  // user.mudule.ts
  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { User } from './entites/user.entites';
  import { UserController } from './user.controller';
  import { UserService } from './user.service';

  @Module({
    imports:[TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService]
  })
  export class UserModule {}
  ```
  11. 将实体注入到对应的server中
  ```js
  import { Injectable } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';

  import { registerBodyDto } from './dto/user.dto';
  import { User } from './entites/user.entites';

  @Injectable()
  export class UserService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository:Repository<User>
    ){}
    async register(registerBodyDto:registerBodyDto) {
      // const registerSql = `
      // INSERT INTO user
      //    (username,nickname,password,repassword,mobile,role)
      // VALUES
      //     ('admin1','admin',123456,123456,18,1)`
      // const data = await this.userRepository.query(registerSql)
      const data = await this.userRepository.save(registerBodyDto)
      return data
    }
  }
  ```
# 配置本地Passport 策略
1. npm install --save @nestjs/passport passport passport-local npm install --save-dev @types/passport-local
2. nest g module auth nest g service auth
3. auth/auth.service.ts
   ```js
    import { Injectable } from '@nestjs/common';
    import { UserService } from 'src/user/user.service';

    @Injectable()
    export class AuthService {
      constructor(private readonly userService:UserService){}
      async valiadateUser(username:string,pass:string):Promise<any>{
        const user = await this.userService.findOne(username)
        if (user && user.password === pass) {
          const {password,...result} = user
          return result
        }
        return null
      }
    }

   ```
4. auth/local.strategy.ts
   ```js
    import { Injectable, UnauthorizedException } from "@nestjs/common";
    import { PassportStrategy } from "@nestjs/passport";
    import { Strategy } from "passport-local";
    import { AuthService } from "./auth.service";

    @Injectable()
    export class LocalStrategy extends PassportStrategy(Strategy){ // strategy是系统自带的策略名  可以使用自定义的替换
      constructor(private readonly authService:AuthService){
        super()
      }
      async validate(username:string,password:string):Promise<any>{
        const user = await this.authService.valiadateUser(username,password)
        if (!user) {
          throw new UnauthorizedException()
        }
        return user
      }
    }
  ```
5. auth/auth.module.ts
   ```js
   import { Module } from '@nestjs/common';
  import { PassportModule } from '@nestjs/passport';
  import { UserModule } from 'src/user/user.module';
  import { AuthService } from './auth.service';
  import { LocalStrategy } from './local.strategy';

  @Module({
    imports:[UserModule,PassportModule],
    providers: [AuthService,LocalStrategy]
  })
  export class AuthModule {}
  ```
# 配置jwt
  1. npm install @nestjs/jwt passport-jwt npm install @types/passport-jwt --save-dev
  2. auth/auth.service.ts
    ```js
    import { Injectable } from '@nestjs/common';
    import { JwtService } from '@nestjs/jwt';
    import { loginBodyDto } from 'src/user/dto/user.dto';
    import { UserService } from 'src/user/user.service';

    @Injectable()
    export class AuthService {
      constructor(
        private readonly userService:UserService,
        private readonly jwtService:JwtService
        ){}
      async login(user:loginBodyDto){
        const payload = {username:user.username,password:user.password}
        return {
          access_token:this.jwtService.sign(payload)
        }
      }
    }
  ```
  3. auth.modeule.ts
  ```js
  import { Module } from '@nestjs/common';
  import { JwtModule } from '@nestjs/jwt';
  import { PassportModule } from '@nestjs/passport';
  import { UserModule } from 'src/user/user.module';
  import { AuthService } from './auth.service';
  import { jwtConstants } from './contants';
  import { LocalStrategy } from './local.strategy';

  @Module({
    imports:[
      UserModule,
      PassportModule,
      JwtModule.register({
        secret:jwtConstants.secret,
        signOptions:{expiresIn:'8h'}
      })
    ],
    providers: [AuthService,LocalStrategy]
  })
  export class AuthModule {}
  ```
  


