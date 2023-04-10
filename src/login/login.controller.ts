import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginResponse } from '@type/LoginResponse';
import LoginDto from './login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async loginUser(
    @Body() dto: LoginDto,
  ): Promise<{ response: LoginResponse; uuid: string }> {
    const findOne = await this.loginService.findOne(dto);

    if (findOne.matches !== 0) {
      return {
        response: 'logged',
        uuid: findOne.uuid,
      };
    }

    return {
      response: 'wrong data',
      uuid: null,
    };
  }
}
