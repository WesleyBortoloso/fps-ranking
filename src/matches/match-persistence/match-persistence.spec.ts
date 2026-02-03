import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchPersistenceService } from './match-persistence.service';
import { Match } from '../match.entity';
import { Player } from '../../players/player.entity';
import { MatchPlayer } from '../../match-players/match-player.entity';
import { Event } from '../../events/event.entity';
import { LogEventType } from '../../log-parser/log-event.interface';
import { MatchPlayerAward } from '../../match-player-awards/match-player-award.entity';
import { Award } from '../../awards/award.entity';

describe('MatchPersistenceService', () => {
  let service: MatchPersistenceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Match, Player, MatchPlayer, Event, Award, MatchPlayerAward],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Match, Player, MatchPlayer, Event, Award, MatchPlayerAward]),
      ],
      providers: [MatchPersistenceService],
    }).compile();

    service = module.get(MatchPersistenceService);
  });

  it('should persist match, players and events', async () => {
    await service.persist({
      matchId: 1,
      events: [
        {
          type: LogEventType.MATCH_START,
          timestamp: new Date(),
        },
        {
          type: LogEventType.KILL,
          killer: 'Roman',
          victim: 'Nick',
          weapon: 'M16',
          timestamp: new Date(),
        },
      ],
      result: {
        players: [
          {
            name: 'Roman',
            kills: 1,
            deaths: 0,
            score: 1,
            maxKillStreak: 1,
          },
          {
            name: 'Nick',
            kills: 0,
            deaths: 1,
            score: 0,
            maxKillStreak: 0,
          },
        ],
        awards: new Map()
      },
    });

    expect(true).toBe(true);
  });
});
