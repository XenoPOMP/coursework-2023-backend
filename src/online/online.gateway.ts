import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { OnlineService } from './online.service';
import appLog from '@utils/appLog';
import { Server } from 'socket.io';
import MsSqlManager from '@sql/MsSqlManager';
import getDateTime from '@utils/getDateTime';
import parseSearchParams from '@utils/parseSearchParams';
import appPrefixes from '@utils/appPrefixes';

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

  loggerPrefix: string = appPrefixes.webSocket;
  errPrefix: string = appPrefixes.error;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      // Get socket id
      const uuid = socket.id;
      // Save connection open time
      const connectionTime = new Date();

      // Parse data from search params
      const allowed =
        parseSearchParams(socket.conn.request.url)['allow'] === 'true';
      const sessionToken = parseSearchParams(socket.conn.request.url)[
        'sessionToken'
      ];
      const userDevice = parseSearchParams(socket.conn.request.url)['device'];

      // Check if analytics are not allowed on client
      if (!allowed) {
        appLog(this.errPrefix, `Changes are forbidden due access level`);
        return;
      }

      // Log user connection
      appLog(this.loggerPrefix, `Socket ID: ${clc.greenBright(uuid)}`);
      appLog(
        this.loggerPrefix,
        `Session token: ${clc.greenBright(sessionToken)}`,
      );
      appLog(this.loggerPrefix, `Connection established`);

      // On user disconnect
      socket.on('disconnect', async (reason) => {
        // Save socket disconnect time
        const disconnectTime = new Date();
        // Calculate user session time in seconds
        const delta = DATE_DIFF(disconnectTime, connectionTime, 's').output;

        // Log info about disconnect
        appLog(
          this.loggerPrefix,
          `Socket ${clc.greenBright(
            uuid,
          )} has been disconnected due to ${clc.yellow(
            reason,
          )}. Session lasted for ${clc.greenBright(`${delta}s`)}`,
        );

        // Execute SQL query
        await this.sqlManager.execQuery(`
        INSERT INTO
        [smartace.analytics.sessionTime]
          (session_token, session_time, session_date, session_device)
        VALUES
          (
            '${sessionToken}', 
            ${delta}, 
            convert(datetime, '${getDateTime({
              sqlLike: true,
            })}', 105),
            '${userDevice}'
          )
        `);
      });
    });
  }

  @SubscribeMessage('enter')
  handleEnterEvent(@MessageBody() data: string): void {
    appLog(this.loggerPrefix, `Received message from 'enter' channel: ${data}`);
  }
}
