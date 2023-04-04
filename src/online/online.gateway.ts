import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { OnlineService } from './online.service';
import appLog from '../utils/appLog';
import { Server } from 'socket.io';
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

  loggerPrefix: string = clc.green('[WS:ONLINE]');

  onModuleInit() {
    this.server.on('connection', (socket) => {
      const uuid = socket.id;
      const connectionTime = new Date();

      appLog(this.loggerPrefix, `User ID: ${clc.greenBright(uuid)}`);
      appLog(this.loggerPrefix, `Connection established`);

      socket.on('disconnect', (reason) => {
        const disconnectTime = new Date();
        const delta = DATE_DIFF(disconnectTime, connectionTime, 's').output;

        appLog(
          this.loggerPrefix,
          `User ${clc.greenBright(uuid)} disconnect due to ${clc.yellow(
            reason,
          )}. Session lasted for ${clc.greenBright(`${delta}s`)}`,
        );
      });
    });
  }

  @SubscribeMessage('enter')
  handleEnterEvent(@MessageBody() data: string): void {
    appLog(this.loggerPrefix, `Received message from 'enter' channel: ${data}`);
  }
}
