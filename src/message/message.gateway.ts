import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ origin: 'http://localhost:3000' })
export class MessageGateway implements OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger('MessageGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('getMessage')
  handleMessage(@MessageBody() data: any): void {
    this.server.emit('getMessage', data);
  }
}
