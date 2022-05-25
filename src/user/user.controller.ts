import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

import { registerBodyDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userServer:UserService,
    // private readonly authService:AuthService
  ){

  }
  @Post('register')   // 注册
  async register(@Body() registerBody:registerBodyDto){
    console.log('registerBody: ', registerBody);
    return this.userServer.register(registerBody)
  }
  @UseGuards(AuthGuard('local'))
  @Post('login')   // 登录
  async login(@Body() req){
    // return req.user
    // return this.authService.login(req)
  }
}
