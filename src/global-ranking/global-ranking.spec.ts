import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Match } from '../matches/match.entity';
import { Player } from '../players/player.entity';
import { MatchPlayer } from '../match-players/match-player.entity';
import { Event } from '../events/event.entity';
import { Award } from '../awards/award.entity';
import { MatchPlayerAward } from '../match-player-awards/match-player-award.entity';

import { GlobalRankingService } from './global-ranking.service';
import { GlobalRankingRepository } from './global-ranking.repository';

describe('GlobalRankingService', () => {
  let service: GlobalRankingService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [
            Match,
            Player,
            MatchPlayer,
            Event,
            Award,
            MatchPlayerAward,
          ],
        }),
        TypeOrmModule.forFeature([
          Match,
          Player,
          MatchPlayer,
          Event,
          Award,
          MatchPlayerAward,
        ]),
      ],
      providers: [GlobalRankingRepository, GlobalRankingService],
    }).compile();

    service = module.get(GlobalRankingService);
    dataSource = module.get(DataSource);

    await seedDatabase(dataSource);
  });

  it('should return global ranking ordered by score desc', async () => {
    const ranking = await service.getGlobalRanking();

    expect(ranking).toHaveLength(2);

    expect(ranking[0]).toMatchObject({
      player: 'Roman',
      kills: 3,
      deaths: 1,
      score: 3,
    });

    expect(ranking[1]).toMatchObject({
      player: 'Nick',
      kills: 1,
      deaths: 3,
      score: 1,
    });
  });
});

async function seedDatabase(dataSource: DataSource) {
  const matchRepo = dataSource.getRepository(Match);
  const playerRepo = dataSource.getRepository(Player);
  const mpRepo = dataSource.getRepository(MatchPlayer);

  const roman = await playerRepo.save({ name: 'Roman' });
  const nick = await playerRepo.save({ name: 'Nick' });

  const match1 = await matchRepo.save({
    externalId: 1,
    startedAt: new Date(),
    endedAt: new Date(),
  });

  const match2 = await matchRepo.save({
    externalId: 2,
    startedAt: new Date(),
    endedAt: new Date(),
  });

  await mpRepo.save([
    {
      match: match1,
      player: roman,
      kills: 2,
      deaths: 0,
      score: 2,
      maxKillStreak: 2,
    },
    {
      match: match1,
      player: nick,
      kills: 1,
      deaths: 2,
      score: 1,
      maxKillStreak: 1,
    },
    {
      match: match2,
      player: roman,
      kills: 1,
      deaths: 1,
      score: 1,
      maxKillStreak: 1,
    },
    {
      match: match2,
      player: nick,
      kills: 0,
      deaths: 1,
      score: 0,
      maxKillStreak: 0,
    },
  ]);
}