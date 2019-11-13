import * as path from 'path';
import * as dotenv from 'dotenv';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { ScoreboardModule } from './scoreboard/scoreboard.module';

const environment = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, `../${environment}.env`);
dotenv.config({ path: configPath });

const MONGO_URL = process.env.MONGO_URL;

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req }) => ({ req }),
      typePaths: ['./**/*.graphql'],
      resolvers: { DateTime: GraphQLDateTime },
      installSubscriptionHandlers: true,
    }),
    MongooseModule.forRoot(MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    }),
    ScoreboardModule,
  ],
  providers: [AppService],
})
export class AppModule {}
