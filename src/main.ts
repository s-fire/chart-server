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
