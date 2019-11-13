import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { ScoreboardResolver } from './resolvers/scoreboard.resolver';
import { ScoreboardService } from './services/scoreboard.service';
import { ScoreBoardSchema } from './schemas/scoreboard.schema';
import { FilterSchema } from './schemas/filter.schema';
import { ScoreboardController } from './scoreboard.controller';

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
  providers: [ScoreboardResolver, ScoreboardService],
  controllers: [ScoreboardController],
})
export class ScoreboardModule {}
