import { HttpException, Injectable, Param } from '@nestjs/common';
import DatediffDto from './datediff.dto';
import MsSqlManager from '../sql/MsSqlManager';
import getDateTime from '../utils/getDateTime';

@Injectable()
export class DatediffService {
  private sqlManager: MsSqlManager = new MsSqlManager();

  async getDiff(@Param('datepart') datePart): Promise<DatediffDto[][]> {
    // SQL sort condition
    let sortCondition = `DATEDIFF(${datePart}, GETDATE(), CONVERT(DATETIME, '${getDateTime(
      {
        sqlLike: true,
      },
    )}')) < 1`;

    // Allowed SQL DATEPARTs
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

    // Param is not allowed
    if (!allowedDateParts.includes(datePart)) {
      throw new HttpException('Wrong date part', 400);
    }

    // Execute SQL query
    return await this.sqlManager.execQuery<DatediffDto[][]>(`
    SELECT 
      MAX(session_time) as 'session_time',
      session_date,
      session_device
    FROM [smartace.analytics.sessionTime]
    WHERE 
      session_time != 0
      AND
      ${sortCondition}
      AND
      session_device IS NOT NULL
    GROUP BY session_token, session_date, session_device
    ORDER BY session_date ASC
    `);
  }
}
