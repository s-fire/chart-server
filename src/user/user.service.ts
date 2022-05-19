import { Injectable } from '@nestjs/common';

import { registerBodyDto } from './dto/user.dto';

@Injectable()
export class UserService {
  async register(registerBodyDto:registerBodyDto) {
    console.log('registerBodyDto: ', registerBodyDto);
    return registerBodyDto
  }
}
