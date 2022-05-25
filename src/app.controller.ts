import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService:AuthService
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('login')   // 登录
  async login(@Body() req){
    // return req.user
    return this.authService.login(req)
  }
}
