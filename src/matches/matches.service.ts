import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly repo: Repository<Match>,
  ) {}

  async listMatches() {
    return this.repo.find({
      select: ['externalId', 'startedAt', 'endedAt'],
      order: { startedAt: 'DESC' },
    });
  }

  async getMatchDetails(matchId: number) {
    const match = await this.repo.findOne({
      where: { externalId: matchId },
      relations: [
        'players',
        'players.player',
        'players.awards',
        'players.awards.award',
      ],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return {
      matchId: match.externalId,
      startedAt: match.startedAt,
      endedAt: match.endedAt,
      players: match.players.map(mp => ({
        name: mp.player.name,
        kills: mp.kills,
        deaths: mp.deaths,
        score: mp.score,
        awards: mp.awards?.map(a => a.award.code) ?? [],
      })),
    };
  }
}