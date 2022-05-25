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