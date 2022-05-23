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
  async  findOne(username:string) {
    const user = this.userRepository.findOne({
      where:{
        username
      }
    })
    return user
  }
  async register(registerBodyDto:registerBodyDto) {
    // const registerSql = `
    // INSERT INTO user
    //    (username,nickname,password,repassword,mobile,role)
    // VALUES
    //     ('admin1','admin',123456,123456,18,1)`
    // const data = await this.userRepository.query(registerSql)
    const {username,nickname,password,repassword} = registerBodyDto
    if (password!== repassword) {
      return {
        code:400,
        msg:'两次密码不一致'
      }
    }
    const user =await this.findOne(username)
    console.log('user: ', user);
    if (user) {
      return {
        code:400,
        msg:'用户已存在'
      }
    }
    const data = await this.userRepository.save(registerBodyDto)
    return data
  }
}
