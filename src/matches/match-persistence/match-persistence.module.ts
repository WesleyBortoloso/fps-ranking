import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "../match.entity";
import { Player } from "../../players/player.entity";
import { MatchPlayer } from "../../match-players/match-player.entity";
import { Award } from "../../awards/award.entity";
import { MatchPlayerAward } from "../../match-player-awards/match-player-award.entity";
import { MatchPersistenceService } from "./match-persistence.service";
import { Event } from '../../events/event.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      Player,
      MatchPlayer,
      Event,
      Award,
      MatchPlayerAward,
    ]),
  ],
  providers: [MatchPersistenceService],
  exports: [MatchPersistenceService],
})
export class MatchPersistenceModule {}
