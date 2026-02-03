import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MatchPlayer } from '../../match-players/match-player.entity';

@Injectable()
export class MatchRankingRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getRankingByMatch(matchId: number) {
    return this.dataSource
      .getRepository(MatchPlayer)
      .createQueryBuilder('mp')
      .innerJoin('mp.match', 'match')
      .innerJoin('mp.player', 'player')
      .leftJoinAndSelect('mp.awards', 'mpa')
      .leftJoinAndSelect('mpa.award', 'award')
      .where('match.externalId = :matchId', { matchId })
      .select([
        'player.name AS player',
        'mp.kills AS kills',
        'mp.deaths AS deaths',
        'mp.score AS score',
        'mp.maxKillStreak AS "maxKillStreak"',
        'award.code AS award',
      ])
      .orderBy('mp.score', 'DESC')
      .getRawMany();
  }
}
