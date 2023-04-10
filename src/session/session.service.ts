import { Injectable, Param, Query } from '@nestjs/common';
import MsSqlManager from '@sql/MsSqlManager';
import DatediffDto from '@/datediff/datediff.dto';
import getDateTime from '@utils/getDateTime';

@Injectable()
export class SessionService {
  private sqlManager: MsSqlManager = new MsSqlManager();

  async getAverageTime(
    @Param('datepart') datePart: string,
    @Query('uuid') uuid: string,
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
          ${
            datePart !== undefined
              ? `
          AND
          DATEDIFF(${datePart}, session_date, CONVERT(DATETIME, '${getDateTime({
                  sqlLike: true,
                })}')) <= 1
          `
              : ''
          }
        GROUP BY session_token, session_date, session_device
        ORDER BY session_date ASC
    `,
      )
      .then((res) => {
        const totalTime = res[0].reduce(
          (prev, next) => prev + next.session_time,
          0,
        );
        const sessionCount = res[0].length;

        return totalTime / sessionCount;
      });
  }

  async getSessionCount(
    @Param('datepart') datePart: string,
    @Query('uuid') uuid: string,
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
          ${
            datePart !== undefined
              ? `
          AND
          DATEDIFF(${datePart}, session_date, CONVERT(DATETIME, '${getDateTime({
                  sqlLike: true,
                })}')) <= 1
          `
              : ''
          }
        GROUP BY session_token, session_date, session_device
        ORDER BY session_date ASC
    `,
      )
      .then((res) => res[0].length);
  }
}
