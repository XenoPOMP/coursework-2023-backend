import { HttpException, Injectable, Param } from '@nestjs/common';
import appLog from '../utils/appLog';
import { clc } from '@nestjs/common/utils/cli-colors.util';

@Injectable()
export class DatediffService {
  async getDiff(@Param('datepart') datePart): Promise<any> {
    switch (datePart) {
      case 'hour': {
        break;
      }

      case 'day': {
        break;
      }

      case 'month': {
        break;
      }

      default: {
        throw new HttpException('Wrong date part', 400);
      }
    }

    return '';
  }
}
