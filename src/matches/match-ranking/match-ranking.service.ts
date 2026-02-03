import { MatchRankingDto } from "../../dtos/match-ranking.dto";
import { MatchRankingRepository } from "./match-ranking.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MatchRankingService {
  constructor(private readonly repo: MatchRankingRepository) {}

  async getRanking(matchId: number): Promise<MatchRankingDto[]> {
    const rows = await this.repo.getRankingByMatch(matchId);

    const grouped = new Map<string, MatchRankingDto>();

    for (const row of rows) {
      if (!grouped.has(row.player)) {
        grouped.set(row.player, {
          player: row.player,
          kills: Number(row.kills),
          deaths: Number(row.deaths),
          score: Number(row.score),
          maxKillStreak: Number(row.maxKillStreak),
          awards: [],
        });
      }

      if (row.award) {
        grouped.get(row.player)!.awards.push(row.award);
      }
    }

    return Array.from(grouped.values());
  }
}
