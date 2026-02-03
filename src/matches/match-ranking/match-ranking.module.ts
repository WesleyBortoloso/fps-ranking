import { Module } from "@nestjs/common";
import { MatchRankingRepository } from "./match-ranking.repository";
import { MatchRankingService } from "./match-ranking.service";

@Module({
  providers: [MatchRankingRepository, MatchRankingService],
  exports: [MatchRankingService],
})
export class MatchRankingModule {}
