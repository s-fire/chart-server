import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule,AuthModule,TypeOrmModule.forRoot({
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
