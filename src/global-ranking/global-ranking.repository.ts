import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MatchPlayer } from '../match-players/match-player.entity';

@Injectable()
export class GlobalRankingRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getGlobalRanking() {
    return this.dataSource
      .getRepository(MatchPlayer)
      .createQueryBuilder('mp')
      .innerJoin('mp.player', 'player')
      .select([
        'player.name AS player',
        'SUM(mp.kills) AS kills',
        'SUM(mp.deaths) AS deaths',
        'SUM(mp.score) AS score',
      ])
      .groupBy('player.name')
      .orderBy('score', 'DESC')
      .getRawMany();
  }
}
