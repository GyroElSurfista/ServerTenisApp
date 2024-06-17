import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

export class GameService {
  private players: Map<string, Socket> = new Map();
  private logger: Logger = new Logger('GameService');

  addPlayer(client: Socket): void {
    this.players.set(client.id, client);
    this.logger.log(`Player added: ${client.id}`);
  }

  removePlayer(client: Socket): void {
    this.players.delete(client.id);
    this.logger.log(`Player removed: ${client.id}`);
  }

  shot(client: Socket, shotIntensity: number): void {
    const opponent = this.getOpponent(client.id);
    if (opponent) {
        opponent.emit('get_shot', { intensity: shotIntensity });
    } else {
      client.emit('error', 'No opponent connected');
    }
  }

  getOpponent(clientId: string): Socket | undefined {
    for (const [id, player] of this.players.entries()) {
      if (id != clientId) {
        return player;
      }
    }

    return undefined;
  }
}
