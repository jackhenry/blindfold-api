import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { format } from 'date-fns';

import { Scoreboard } from '../interfaces/scoreboard.interface';
import { CreateScoreboardDto } from '../interfaces/scoreboard.dto';

import Teams from '../../data/teams';
import { Team } from '../interfaces/team.interface';
import { Filter } from '../interfaces/filter.interface';
import { UpdateResult } from '../../mongoose/update.interface';

@Injectable()
export class ScoreboardService {
  constructor(
    @InjectModel('Scoreboard')
    private readonly scoreboardModel: Model<Scoreboard>,
    @InjectModel('Filter')
    private readonly filterModel: Model<Filter>,
  ) {}

  /**
   * Scoreboard
   */
  async findAll(league: string | undefined): Promise<Scoreboard[]> {
    const condition =
      league === undefined ? {} : { league: league.toUpperCase() };
    const scoreboards = await this.scoreboardModel.find(condition).exec();
    return this.sortScoreboards(scoreboards);
  }

  async scoreboards(
    league: string,
    filterValue: number,
  ): Promise<Scoreboard[]> {
    const condition =
      league.toUpperCase() === 'NFL'
        ? {
            league: league.toUpperCase(),
            week: filterValue,
          }
        : {
            league: league.toUpperCase(),
            date: new Date(filterValue * 1000),
          };

    return await this.scoreboardModel
      .find(condition)
      .sort({ date: -1 })
      .exec();
  }

  async create(dto: CreateScoreboardDto): Promise<UpdateResult> {
    const homeTeamData = this.findTeamDataByTeamName(dto.homeTeamName);
    const awayTeamData = this.findTeamDataByTeamName(dto.awayTeamName);

    const updateResult: UpdateResult = await this.scoreboardModel
      .updateOne(
        {
          date: dto.date,
          homeTeamName: dto.homeTeamName,
          awayTeamName: dto.awayTeamName,
        },
        {
          ...dto,
          ...homeTeamData,
          ...awayTeamData,
        },
        { upsert: true, setDefaultsOnInsert: true },
      )
      .exec();

    if (dto.league.toLowerCase() === 'nfl') {
      await this.filterModel
        .updateOne(
          {
            league: dto.league,
            filterValue: dto.week,
            filterLabel: `Week ${dto.week}`,
          },
          {
            league: dto.league,
            filterValue: dto.week,
            filterLabel: `Week ${dto.week}`,
          },
          {
            upsert: true,
          },
        )
        .exec();
    } else {
      const date = new Date(dto.date);
      const formattedDate = format(date, 'MMMM do');
      const unixTime = date.getTime() / 1000;
      await this.filterModel
        .updateOne(
          {
            league: dto.league,
            filterValue: unixTime,
            filterLabel: formattedDate,
          },
          {
            league: dto.league,
            filterValue: unixTime,
            filterLabel: formattedDate,
          },
          {
            upsert: true,
          },
        )
        .exec();
    }

    return updateResult;
  }

  sortScoreboards(scoreboards: Scoreboard[]): Scoreboard[] {
    const scoreboardsCopy = [...scoreboards];
    scoreboardsCopy.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    });

    return scoreboardsCopy;
  }

  findTeamDataByTeamName(name: string): Team | undefined {
    return Teams.find(
      team => team.shortName.toLowerCase() === name.toLowerCase(),
    );
  }

  /**
   * AvailableFilters
   */
  //TODO: standardize league to always be Uppercase
  async findFilters(league: string): Promise<Filter[]> {
    return await this.filterModel
      .find({ league: league.toUpperCase() })
      .sort({ filterValue: -1 })
      .exec();
  }
}
