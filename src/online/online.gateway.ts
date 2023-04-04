import { WebSocketGateway } from '@nestjs/websockets';
import { OnlineService } from './online.service';

@WebSocketGateway(parseInt(process.env.SOCKETS_ONLINE_PORT))
export class OnlineGateway {
  constructor(private readonly onlineService: OnlineService) {}
}
