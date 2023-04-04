import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OnlineModule } from './online/online.module';

@Module({
  imports: [OnlineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
