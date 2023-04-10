import { Module } from '@nestjs/common';
import { DatediffService } from '@/datediff/datediff.service';
import { DatediffController } from '@/datediff/datediff.controller';

@Module({
  controllers: [DatediffController],
  providers: [DatediffService],
})
export class DatediffModule {}
