import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginResponse } from '../types/LoginResponse';
import LoginDto from './login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async loginUser(
    @Body() dto: LoginDto,
  ): Promise<{ response: LoginResponse; uuid: string }> {
    const findOne = await this.loginService.findOne(dto);

    if (findOne !== '') {
      return {
        response: 'logged',
        uuid: findOne,
      };
    }

    return {
      response: 'wrong data',
      uuid: null,
    };
  }
}
