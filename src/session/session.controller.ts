import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import allowedDateParts from '@type/allowedDateParts';
import findOne from '@utils/findOne';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('/average/:datepart')
  async getAverageTime(
    @Param('datepart') datePart: string,
    @Query('uuid') uuid: string,
  ): Promise<{ time: number }> {
    // Param is not allowed
    if (!allowedDateParts.includes(datePart)) {
      throw new BadRequestException('Wrong date part');
    }

    // User is not authorized
    if (!(await findOne(uuid))) {
      throw new UnauthorizedException();
    }

    return {
      time: await this.sessionService.getAverageTime(datePart, uuid),
    };
  }

  @Get('/count/:datepart')
  async getSessionCount(
    @Param('datepart') datePart: string,
    @Query('uuid') uuid: string,
  ): Promise<{ count: number }> {
    // Param is not allowed
    if (!allowedDateParts.includes(datePart)) {
      throw new BadRequestException('Wrong date part');
    }

    // User is not authorized
    if (!(await findOne(uuid))) {
      throw new UnauthorizedException();
    }

    return {
      count: await this.sessionService.getSessionCount(datePart, uuid),
    };
  }
}
