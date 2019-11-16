import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { ScoreboardService } from '../services/scoreboard.service';
import { CreateScoreboardDto } from '../interfaces/scoreboard.dto';

@Resolver('Scoreboard')
export class ScoreboardResolver {
  constructor(private readonly scoreboardService: ScoreboardService) {}

  @Query('findScoreboards')
  async findAll(@Args('league') league: string) {
    return await this.scoreboardService.findAll(league);
  }

  @Query('scoreboards')
  async scoreboards(
    @Args('league') league: string,
    @Args('filterValue') filterValue: number,
  ) {
    return await this.scoreboardService.scoreboards(league, filterValue);
  }

  @Query('filters')
  async findFilters(@Args('league') league: string) {
    return await this.scoreboardService.findFilters(league);
  }

  @Mutation('createScoreboard')
  async createScoreboard(@Args('input') dto: CreateScoreboardDto) {
    return await this.scoreboardService.update(dto);
  }
}
