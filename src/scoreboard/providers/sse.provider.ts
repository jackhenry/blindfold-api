import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SSEProvider {
  private clients: Request[];

  addClient(req: Request): void {
    this.clients.push(req);
  }
}
