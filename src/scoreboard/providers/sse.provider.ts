import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import * as scheduler from 'node-schedule';

@Injectable()
export class SSEProvider {
  private clients: { sessionID: Response } | {};
  private messageBatch;

  constructor() {
    this.clients = {};
    this.messageBatch = [];
    this.scheduleBatchMessaging();
  }

  async scheduleBatchMessaging() {
    console.log('starting scheduler..');

    scheduler.scheduleJob('*/10 * * * * *', () => {
      console.log('running job');

      if (this.messageBatch.length > 0) {
        console.log(`sending batch with ${this.messageBatch.length} messages`);
        this.emit('scoreboard', JSON.stringify(this.messageBatch));
        this.messageBatch = [];
      } else {
        console.log('No messages to dispatch');
      }
    });
  }

  addClient(sessionID: string, res: Response): void {
    this.clients[sessionID] = res;
  }

  removeClient(sessionID: string): void {
    delete this.clients[sessionID];
  }

  getClient(sessionID: string): Response {
    return this.clients[sessionID];
  }

  getClients(): { sessionID: Response } | {} {
    return this.clients;
  }

  addToBatch(message): void {
    this.messageBatch.push(message);
  }

  emit(event: string, data: any): void {
    console.log(Object.keys(this.clients).length);
    const message = `event: ${event}\ndata: ${data}\n\n\n`;

    Object.values(this.clients).forEach(client => {
      console.log('sending to client');
      client.write(message);
    });
  }
}
