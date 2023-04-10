import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { OnlineModule } from '@/online/online.module';
import { DevicesModule } from '@/devices/devices.module';
import { LoginModule } from '@/login/login.module';

@Module({
  imports: [OnlineModule, DevicesModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
