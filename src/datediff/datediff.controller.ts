import { Controller, Get, Param } from '@nestjs/common';
import { DatediffService } from './datediff.service';
import DatediffDto from './datediff.dto';

@Controller('datediff')
export class DatediffController {
  constructor(private readonly datediffService: DatediffService) {}

  @Get('/:datepart')
  async getDiff(@Param('datepart') datePart): Promise<DatediffDto[]> {
    return this.datediffService
      .getDiff(datePart)
      .then((response) => response[0]);
  }
}
