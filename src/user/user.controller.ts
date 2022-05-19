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
    console.log('registerBody: ', registerBody);
    return this.userServer.register(registerBody)
  }
  @Post('login')   // 登录
  async login(){
    return `login`
  }
}
