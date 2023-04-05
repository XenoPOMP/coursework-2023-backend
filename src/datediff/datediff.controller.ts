import { Controller, Get, Param } from '@nestjs/common';
import { DatediffService } from './datediff.service';

@Controller('datediff')
export class DatediffController {
  constructor(private readonly datediffService: DatediffService) {}

  @Get('/:datepart')
  async getDiff(@Param('datepart') datePart): Promise<any> {
    return await this.datediffService.getDiff(datePart);
  }
}
