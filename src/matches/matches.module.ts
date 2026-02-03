import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { MatchesController } from './matches.controller';
import { MatchRankingModule } from './match-ranking/match-ranking.module';
import { MatchPlayer } from '../match-players/match-player.entity';
import { Player } from '../players/player.entity';
import { Award } from '../awards/award.entity';
import { MatchPlayerAward } from '../match-player-awards/match-player-award.entity';
import { Event } from '../events/event.entity'

@Module({
  controllers: [MatchesController],
  providers: [
    MatchesService
  ],
  imports: [
    TypeOrmModule.forFeature([
      Match,
      Event,
      MatchPlayer,
      Player,
      Award,
      MatchPlayerAward,
    ]),
    MatchRankingModule,
  ],
})
export class MatchesModule {}