import { WebSocketGateway } from '@nestjs/websockets';
import { OnlineService } from './online.service';

@WebSocketGateway()
export class OnlineGateway {
  constructor(private readonly onlineService: OnlineService) {}
}
