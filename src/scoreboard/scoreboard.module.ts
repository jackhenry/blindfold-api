import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { ScoreboardResolver } from './resolvers/scoreboard.resolver';
import { ScoreboardService } from './services/scoreboard.service';
import { ScoreBoardSchema } from './schemas/scoreboard.schema';
import { FilterSchema } from './schemas/filter.schema';
import { ScoreboardController } from './scoreboard.controller';
import { SSEProvider } from './providers/sse.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Filter', schema: FilterSchema },
      {
        name: 'Scoreboard',
        schema: ScoreBoardSchema,
      },
    ]),
  ],
  providers: [ScoreboardResolver, ScoreboardService, SSEProvider],
  controllers: [ScoreboardController],
})
export class ScoreboardModule {}
