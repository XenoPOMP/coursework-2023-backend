import * as sql from 'mssql';
import appLog from '@utils/appLog';
import appPrefixes from '@utils/appPrefixes';

require('dotenv').config();
const env = process.env;
const clc = require('cli-color');

const config = {
  user: `${env.MS_SQL_USER}_db`,
  password: `${env.MS_SQL_USER}`,
  server: `stud-mssql.sttec.yar.ru`,
  database: `${env.MS_SQL_USER}_db`,
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    instancename: '',
    trustServerCertificate: true,
  },
  port: 38325,
};

class MsSqlManager {
  private messagePrefix: string = appPrefixes.mssql;

  public async execQuery<QResult>(query: string): Promise<QResult> {
    // prettier-ignore
    try {
      let pool = await sql.connect(config);
      appLog(this.messagePrefix, `Pool opened...`);

      let res = await pool.request().query(query).then(res => {
        appLog(this.messagePrefix, `Request fulfilled successfully...`);
        return res;
      });

      appLog(this.messagePrefix, `Find results: ${res?.recordsets[0] !== undefined ? res?.recordsets[0].length : 'none'}.`);

      await pool.close();
      appLog(this.messagePrefix, `Pool closed...`);

      return res.recordsets as QResult;
    }
    catch (error) {
      appLog(this.messagePrefix, `${clc.red('mathus-error')}: ${error}`);
    }
  }
}

export { MsSqlManager as default };
