import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('scoreboard')
export class ScoreboardController {
  @Get()
  hello(@Req() req: Request, @Res() res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');

    console.log(req);

    let messageId = 0;

    const intervalId = setInterval(() => {
      //console.log('sending...');
      res.write(`id: ${messageId}\n`);
      res.write(`data: Test Message -- ${Date.now()}\n\n`);
      messageId += 1;
    }, 1000);

    req.on('close', () => {
      console.log('closed');
      clearInterval(intervalId);
    });
  }
}
