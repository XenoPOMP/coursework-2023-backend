import { Module } from '@nestjs/common';
import { LoginService } from '@/login/login.service';
import { LoginController } from '@/login/login.controller';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
