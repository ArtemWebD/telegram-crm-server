import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket/socket.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger('AppGateway');

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.socket = server;
    this.logger.log('Socket was inited');
  }

  @SubscribeMessage('messageConnect')
  connectionHandler(client: Socket, token: string) {
    client.join(token);
    this.server.to(token).emit('messageConnect', true);
  }

  @SubscribeMessage('messageDisconnect')
  disconnectionHandler(client: Socket, token: string) {
    client.leave(token);
  }
}
