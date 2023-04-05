import { HttpException, Injectable, Param } from '@nestjs/common';
import DatediffDto from './datediff.dto';
import MsSqlManager from '../sql/MsSqlManager';
import getDateTime from '../utils/getDateTime';

@Injectable()
export class DatediffService {
  private sqlManager: MsSqlManager = new MsSqlManager();

  async getDiff(@Param('datepart') datePart): Promise<DatediffDto[][]> {
    let sortCondition = `DATEDIFF(${datePart}, GETDATE(), CONVERT(DATETIME, '${getDateTime(
      {
        sqlLike: true,
      },
    )}')) < 1`;

    // prettier-ignore
    const allowedDateParts = [
      'year', 'yy', 'yyyy',
      'quarter', 'qq', 'q',
      'month', 'mm', 'm',
      'dayofyear', 'dy', 'y',
      'day', 'dd', 'd',
      'week', 'wk', 'ww',
      'weekday', 'dw',
      'hour', 'hh',
      'minute', 'mi', 'n',
      'second', 'ss', 's',
      'millisecond', 'ms',
      'microsecond', 'mcs'
    ];

    if (!allowedDateParts.includes(datePart)) {
      throw new HttpException('Wrong date part', 400);
    }

    return await this.sqlManager.execQuery<DatediffDto[][]>(`
    SELECT 
      MAX(session_time) as 'session_time',
      session_date
    FROM [smartace.analytics.sessionTime]
    WHERE 
      session_time != 0
      AND
      ${sortCondition}
    GROUP BY session_token, session_date
    ORDER BY session_date ASC
    `);
  }
}
