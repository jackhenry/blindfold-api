import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SSEProvider } from './providers/sse.provider';

@Controller('scoreboard')
export class ScoreboardController {
  constructor(private readonly sse: SSEProvider) {}

  @Get()
  hello(@Req() req: Request, @Res() res: Response) {
    const { sessionID } = req;
    this.sse.addClient(sessionID, res);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');

    const intervalId = setInterval(() => {
      /* console.log(Object.keys(this.sse.getClients()));
      this.sse.addToBatch({
        hello: 'batch',
        date: new Date().toLocaleString(),
      }); */
    }, 3000);

    req.on('close', () => {
      this.sse.removeClient(sessionID);
      console.log('closed');
      clearInterval(intervalId);
    });
  }
}
