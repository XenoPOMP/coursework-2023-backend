import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Get, OnModuleInit, Param, Query } from '@nestjs/common';
import { OnlineService } from './online.service';
import appLog from '../utils/appLog';
import { Server } from 'socket.io';
import MsSqlManager from '../sql/MsSqlManager';
import getDateTime from '../utils/getDateTime';
const clc = require('cli-color');
const DATE_DIFF = require('date-diff-js');

@WebSocketGateway(80, {
  cors: {
    origin: '*',
  },
})
export class OnlineGateway implements OnModuleInit {
  constructor(private readonly onlineService: OnlineService) {}

  @WebSocketServer()
  server: Server;

  sqlManager: MsSqlManager = new MsSqlManager();

  loggerPrefix: string = clc.green('[WS:ONLINE]');
  errPrefix: string = clc.red('[ERR]');

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      const uuid = socket.id;
      const connectionTime = new Date();

      const allowed =
        /allow=\w+&/i
          ?.exec(socket.conn.request.url)
          ?.toString()
          ?.replace(/(allow=)|&/gi, '') === 'true';
      const jwt = socket.conn.request.url.split('&')[1].replace('jwt=', '');

      // Check if analytics are not allowed on client
      if (!allowed) {
        appLog(this.errPrefix, `Changes are forbidden due access level`);
        return;
      }

      // Log user connection
      appLog(this.loggerPrefix, `User ID: ${clc.greenBright(uuid)}`);
      appLog(this.loggerPrefix, `JWT: ${clc.greenBright(jwt)}`);
      appLog(this.loggerPrefix, `Connection established`);

      // On user disconnect
      socket.on('disconnect', async (reason) => {
        const disconnectTime = new Date();
        const delta = DATE_DIFF(disconnectTime, connectionTime, 's').output;

        appLog(
          this.loggerPrefix,
          `User ${clc.greenBright(uuid)} disconnect due to ${clc.yellow(
            reason,
          )}. Session lasted for ${clc.greenBright(`${delta}s`)}`,
        );

        await this.sqlManager.execQuery(`
        INSERT INTO
        [smartace.analytics.sessionTime]
          (session_token, session_time, session_date)
        VALUES
          ('${jwt}', ${delta}, convert(datetime, '${getDateTime({
          sqlLike: true,
        })}', 105))
        `);
      });
    });
  }

  @SubscribeMessage('enter')
  handleEnterEvent(@MessageBody() data: string): void {
    appLog(this.loggerPrefix, `Received message from 'enter' channel: ${data}`);
  }
}
