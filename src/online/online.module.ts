import { Module } from '@nestjs/common';
import { OnlineService } from '@/online/online.service';
import { OnlineGateway } from '@/online/online.gateway';

@Module({
  providers: [OnlineGateway, OnlineService],
})
export class OnlineModule {}
