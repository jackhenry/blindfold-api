import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import * as session from 'express-session';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  //TODO: change secret
  app.use(
    session({
      secret: 'test-secret',
    }),
  );
  await app.listen(3001);
}
bootstrap();
