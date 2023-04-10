import { HttpException, Injectable, Param } from '@nestjs/common';
import DevicesDto from './devices.dto';
import MsSqlManager from '../sql/MsSqlManager';
import DatediffDto from '../datediff/datediff.dto';
import allowedDateParts from '../types/allowedDateParts';

@Injectable()
export class DevicesService {
  private sqlManager: MsSqlManager = new MsSqlManager();

  private async getDeviceCount(): Promise<number | undefined> {
    return await this.sqlManager
      .execQuery<DatediffDto[][]>(
        `
        SELECT 
        MAX(session_time) as 'session_time',
        session_date,
        session_device
        FROM [smartace.analytics.sessionTime]
        WHERE 
          session_time != 0
          AND
          session_device IS NOT NULL
          AND
          session_device != 'undefined'
        GROUP BY session_token, session_date, session_device
        ORDER BY session_date ASC
      `,
      )
      .then((res) => {
        return res[0].length;
      });
  }

  private async getPlatformCount(
    platform: 'desktop' | 'mobile',
  ): Promise<number> {
    return await this.sqlManager
      .execQuery<DatediffDto[][]>(
        `
        SELECT 
        MAX(session_time) as 'session_time',
        session_date,
        session_device
        FROM [smartace.analytics.sessionTime]
        WHERE 
          session_time != 0
          AND
          session_device IS NOT NULL
          AND
          session_device != 'undefined'
          AND
          session_device = '${platform}'
        GROUP BY session_token, session_date, session_device
        ORDER BY session_date ASC
      `,
      )
      .then((res) => {
        return res[0].length;
      });
  }

  async getPercents(@Param('datepart') datePart: string): Promise<{
    desktop: number;
    mobile: number;
  }> {
    // Param is not allowed
    if (!allowedDateParts.includes(datePart)) {
      throw new HttpException('Wrong date part', 400);
    }

    const desktopCount = await this.getPlatformCount('desktop');
    const mobileCount = await this.getPlatformCount('mobile');
    const totalCount = await this.getDeviceCount();

    return {
      desktop: (desktopCount / totalCount) * 100,
      mobile: (mobileCount / totalCount) * 100,
    };
  }
}
