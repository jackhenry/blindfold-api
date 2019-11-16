import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { format } from 'date-fns';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

import { Scoreboard } from '../interfaces/scoreboard.interface';
import {
  CreateScoreboardDto,
  UpdateScoreboardDto,
} from '../interfaces/scoreboard.dto';

import Teams from '../../data/teams';
import { Team } from '../interfaces/team.interface';
import { Filter } from '../interfaces/filter.interface';
import { UpdateResult } from '../../mongoose/update.interface';
import { SSEProvider } from '../providers/sse.provider';

dayjs.extend(utc);
dayjs.extend(advancedFormat);

@Injectable()
export class ScoreboardService {
  constructor(
    @InjectModel('Scoreboard')
    private readonly scoreboardModel: Model<Scoreboard>,
    @InjectModel('Filter')
    private readonly filterModel: Model<Filter>,
    private readonly sseProvider: SSEProvider,
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

  async create(dto: CreateScoreboardDto): Promise<Scoreboard> {
    await this.createFilter(dto);
    await this.sseProvider.addToBatch(dto);
    return await new this.scoreboardModel(dto).save();
  }

  async update(dto: UpdateScoreboardDto): Promise<Scoreboard> {
    console.log(dto);
    const homeTeamData = this.findTeamDataByTeamName(dto.homeTeamName);
    const awayTeamData = this.findTeamDataByTeamName(dto.awayTeamName);

    const updateCondition = {
      gameId: dto.gameId,
    };

    const scoreboard = await this.scoreboardModel
      .findOne(updateCondition)
      .exec();

    // Scoreboard not found, create one
    if (scoreboard === null) {
      const createDto = this.mergeTeamData(dto, homeTeamData, awayTeamData);
      return await this.create(createDto);
    }

    const updateResult = await scoreboard.updateOne(dto).exec();

    await this.createFilter(dto);
    if (updateResult.nModified > 0) {
      const originalObj = scoreboard.toObject();
      const newObj = this.mergeTeamData(dto, homeTeamData, awayTeamData);
      const diff = this.shallowDiff(dto.gameId, originalObj, newObj);
      this.sseProvider.addToBatch(diff);
    }

    return scoreboard;
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

  mergeTeamData(
    dto: UpdateScoreboardDto,
    homeTeam: Team,
    awayTeam: Team,
  ): CreateScoreboardDto {
    return {
      ...dto,
      ...homeTeam,
      ...awayTeam,
      homeTeamImage: homeTeam.image,
      homeTeamAbbreviation: homeTeam.abbreviation,
      homeTeamColor: homeTeam.color,
      awayTeamImage: awayTeam.image,
      awayTeamAbbreviation: awayTeam.abbreviation,
      awayTeamColor: awayTeam.color,
    };
  }

  shallowDiff(
    gameId: string,
    originalObj: CreateScoreboardDto,
    newObj: CreateScoreboardDto,
  ) {
    const keyBlacklist = ['_id', '__v'];
    const updatedKeys = Object.keys(originalObj).filter(key => {
      const originalValue = originalObj[key];
      const newValue = newObj[key];

      if (key === 'date') {
        const originalDate = new Date(originalValue);
        const newDate = new Date(newValue);

        return !(newDate.getTime() === originalDate.getTime());
      }

      if (originalValue instanceof Date) {
        return originalValue.getTime() === newValue.getTime();
      }

      if (keyBlacklist.includes(key)) return false;

      // If array, it is required to check each element
      if (Array.isArray(originalValue)) {
        if (originalValue === newValue) return false;
        if (originalValue.length !== newValue.length) return true;
        for (let i = 0; i < originalValue.length; i++) {
          if (originalValue[i] !== newValue[i]) return true;
        }

        return false;
      }

      return !(originalObj[key] === newObj[key]);
    });

    let diff = {
      gameId: gameId,
    };
    updatedKeys.forEach(key => (diff[key] = newObj[key]));

    return diff;
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

  async createFilter(dto: UpdateScoreboardDto): Promise<UpdateResult> {
    //Filter value and label depend directly on if league is nfl
    const isNFL = dto.week !== null;

    // Needs to be converted to UTC because date will automatically
    // convert to local timezone.
    const date = new Date(dto.date);
    const formattedDate = dayjs.utc(date).format('MMMM Do');
    const unixTime = dayjs.utc(date).unix();

    // Filter value is either unix time or week if league is nfl
    const filterValue = isNFL ? dto.week : unixTime;
    const filterLabel = isNFL ? `Week ${dto.week}` : formattedDate;

    const updateResult: UpdateResult = await this.filterModel
      .updateOne(
        {
          league: dto.league,
          filterValue: filterValue,
          filterLabel: filterLabel,
        },
        {
          league: dto.league,
          filterValue: filterValue,
          filterLabel: filterLabel,
        },
        {
          upsert: true,
        },
      )
      .exec();

    return updateResult;
  }
}
