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
export class loginBodyDto{
  @IsString()
  readonly username:string;
  @IsString()
  readonly password:string
}