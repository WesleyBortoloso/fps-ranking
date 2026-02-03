import { Injectable } from '@nestjs/common';
import { GlobalRankingRepository } from './global-ranking.repository';

@Injectable()
export class GlobalRankingService {
  constructor(private readonly repo: GlobalRankingRepository) {}

  async getGlobalRanking() {
    const rows = await this.repo.getGlobalRanking();

    return rows.map(row => ({
      player: row.player,
      kills: Number(row.kills),
      deaths: Number(row.deaths),
      score: Number(row.score),
    }));
  }
}
