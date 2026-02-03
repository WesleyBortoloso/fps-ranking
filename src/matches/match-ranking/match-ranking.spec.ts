import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Match } from '../match.entity';
import { Player } from '../../players/player.entity';
import { MatchPlayer } from '../../match-players/match-player.entity';
import { Event } from '../../events/event.entity';
import { MatchRankingRepository } from './match-ranking.repository';
import { MatchRankingService } from './match-ranking.service';
import { Award } from '../../awards/award.entity';
import { MatchPlayerAward } from '../../match-player-awards/match-player-award.entity';

describe('MatchRankingService', () => {
  let service: MatchRankingService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [Match, Player, MatchPlayer, Event, Award, MatchPlayerAward],
        }),
        TypeOrmModule.forFeature([Match, Player, MatchPlayer, Event, Award, MatchPlayerAward]),
      ],
      providers: [MatchRankingRepository, MatchRankingService],
    }).compile();

    service = module.get(MatchRankingService);
    dataSource = module.get(DataSource);

    await seedDatabase(dataSource);
  });

  it('should return ranking ordered by score desc', async () => {
    const ranking = await service.getRanking(1);

    expect(ranking).toHaveLength(2);

    expect(ranking[0]).toMatchObject({
      player: 'Roman',
      kills: 2,
      deaths: 0,
      score: 2,
    });

    expect(ranking[1]).toMatchObject({
      player: 'Nick',
      kills: 0,
      deaths: 2,
      score: 0,
    });
  });
});

async function seedDatabase(dataSource: DataSource) {
  const matchRepo = dataSource.getRepository(Match);
  const playerRepo = dataSource.getRepository(Player);
  const matchPlayerRepo = dataSource.getRepository(MatchPlayer);

  const match = await matchRepo.save({
    externalId: 1,
    startedAt: new Date(),
    endedAt: new Date(),
  });

  const roman = await playerRepo.save({ name: 'Roman' });
  const nick = await playerRepo.save({ name: 'Nick' });

  await matchPlayerRepo.save([
    {
      match,
      player: roman,
      kills: 2,
      deaths: 0,
      score: 2,
      maxKillStreak: 2,
    },
    {
      match,
      player: nick,
      kills: 0,
      deaths: 2,
      score: 0,
      maxKillStreak: 0,
    },
  ]);
}
