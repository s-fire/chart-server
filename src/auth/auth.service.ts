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
  async valiadateUser(username:string,pass:string):Promise<any>{
    const user = await this.userService.findOne(username)
    if (user && user.password === pass) {
      const {password,...result} = user
      return result
    }
    return null
  }
  async login(user:loginBodyDto){
    const payload = {username:user.username,password:user.password}
    return {
      access_token:this.jwtService.sign(payload)
    }
  }
}
