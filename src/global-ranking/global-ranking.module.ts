import { Module } from "@nestjs/common";
import { GlobalRankingRepository } from "./global-ranking.repository";
import { GlobalRankingService } from "./global-ranking.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatchPlayer } from '../match-players/match-player.entity';
import { Player } from '../players/player.entity';
import { Award } from '../awards/award.entity';
import { MatchPlayerAward } from '../match-player-awards/match-player-award.entity';
import { Event } from '../events/event.entity'
import { Match } from '../matches/match.entity'
import { GlobalRankingController } from "./global-ranking.controller";
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Match,
      Event,
      MatchPlayer,
      Player,
      Award,
      MatchPlayerAward
    ]),
  ],
  controllers: [GlobalRankingController],
  providers: [GlobalRankingRepository, GlobalRankingService],
  exports: [GlobalRankingService],
})
export class GlobalRankingModule {}
