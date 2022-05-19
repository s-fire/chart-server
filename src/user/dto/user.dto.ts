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