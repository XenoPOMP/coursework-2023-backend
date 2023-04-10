import { Module } from '@nestjs/common';
import { DatediffService } from './datediff.service';
import { DatediffController } from './datediff.controller';

@Module({
  controllers: [DatediffController],
  providers: [DatediffService],
})
export class DatediffModule {}
