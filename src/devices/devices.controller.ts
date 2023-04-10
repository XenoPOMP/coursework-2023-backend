import { Controller, Get, Param, Query } from '@nestjs/common';
import { DevicesService } from '@/devices/devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get('/:datepart')
  async getDeviceCount(
    @Param('datepart') datePart: string,
    @Query('uuid') uuid,
  ) {
    return this.devicesService.getPercents(datePart, uuid);
  }
}
