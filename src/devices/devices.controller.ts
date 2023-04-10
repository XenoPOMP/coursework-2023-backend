import { Controller, Get, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get('/:datepart/')
  async getDeviceCount(@Param('datepart') datePart: string) {
    return this.devicesService.getPercents(datePart);
  }
}
