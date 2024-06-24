import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { ShotDTO } from './dtos/shot.dto';

@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(
    '@WebSocketServer() server: Server;GameGateway',
  );

  constructor(private readonly gameService: GameService){}

  afterInit(server: Server) {
      this.logger.log('Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
      this.logger.log(`Client connected: ${client.id}`);
      this.gameService.addPlayer(client);
  }

  handleDisconnect(client:Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
      this.gameService.removePlayer(client);
  }

  @SubscribeMessage('shot')
  handleShot(@MessageBody() data: ShotDTO, @ConnectedSocket() client: Socket):void{
    const { intensity } = data;
    this.logger.log(`Shot by ${client.id} with shot intensity: ${intensity}`);
    this.gameService.shot(client, intensity);
  }

}
