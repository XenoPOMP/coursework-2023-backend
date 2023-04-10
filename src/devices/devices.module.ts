import { Module } from '@nestjs/common';
import { DevicesService } from '@/devices/devices.service';
import { DevicesController } from '@/devices/devices.controller';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
