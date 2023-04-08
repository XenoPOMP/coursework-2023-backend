import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginResponse } from '../types/LoginResponse';
import LoginDto from './login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async loginUser(@Body() dto: LoginDto): Promise<{ response: LoginResponse }> {
    const findOne = await this.loginService.findOne(dto);

    if (findOne) {
      return {
        response: 'logged',
      };
    }

    return {
      response: 'wrong data',
    };
  }
}
