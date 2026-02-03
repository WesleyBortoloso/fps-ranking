import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../match.entity';
import { Player } from '../../players/player.entity';
import { MatchPlayer } from '../../match-players/match-player.entity';
import { Event, EventType } from '../../events/event.entity';
import { LogEvent, LogEventType } from '../../log-parser/log-event.interface';
import { PersistMatchInput } from './match-persistance-interface';
import { Award } from '../../awards/award.entity';
import { MatchPlayerAward } from '../../match-player-awards/match-player-award.entity';

@Injectable()
export class MatchPersistenceService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,

    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,

    @InjectRepository(MatchPlayer)
    private readonly matchPlayerRepo: Repository<MatchPlayer>,

    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async persist(input: PersistMatchInput): Promise<void> {
    await this.matchRepo.manager.transaction(async manager => {
      const existingMatch = await manager.findOne(Match, {
        where: { externalId: input.matchId },
      });

      if (existingMatch) {
        return { skipped: true };
      }

      const match = manager.create(Match, {
        externalId: input.matchId,
        startedAt: input.events[0].timestamp,
        endedAt: input.events[input.events.length - 1].timestamp,
      });

      await manager.save(match);
      const playerMap = new Map<string, Player>();

      const matchPlayerMap = new Map<string, MatchPlayer>();

      for (const p of input.result.players) {
        let player = await manager.findOne(Player, {
          where: { name: p.name },
        });

        if (!player) {
          player = manager.create(Player, { name: p.name });
          await manager.save(player);
        }

        playerMap.set(p.name, player);

        const matchPlayer = manager.create(MatchPlayer, {
          match,
          player,
          kills: p.kills,
          deaths: p.deaths,
          score: p.score,
          maxKillStreak: p.maxKillStreak,
        });

        await manager.save(matchPlayer);
        matchPlayerMap.set(p.name, matchPlayer);
      }

      for (const [playerName, awardCodes] of input.result.awards ?? []) {
        const matchPlayer = matchPlayerMap.get(playerName);
        if (!matchPlayer) continue;

        for (const code of awardCodes) {
          let award = await manager.findOne(Award, {
            where: { code },
          });

          if (!award) {
            award = manager.create(Award, { code });
            await manager.save(award);
          }

          const matchPlayerAward = manager.create(MatchPlayerAward, {
            matchPlayer,
            award,
          });

          await manager.save(matchPlayerAward);
        }
      }

      for (const e of input.events) {
        const event = new Event();

        event.match = match;
        event.timestamp = e.timestamp;
        event.type = this.mapEventType(e.type);
        event.killer =
        e.killer && e.killer !== '<WORLD>'
          ? this.getPlayerOrThrow(playerMap, e.killer)
          : null;
        event.victim = e.victim ? this.getPlayerOrThrow(playerMap, e.victim) : null;
        event.weapon = e.weapon || null;

        await manager.save(event);
      }
    });
  }

  private mapEventType(type: LogEventType): EventType {
    switch (type) {
      case LogEventType.MATCH_START:
        return EventType.MATCH_START;
      case LogEventType.MATCH_END:
        return EventType.MATCH_END;
      case LogEventType.KILL:
        return EventType.KILL;
      case LogEventType.WORLD_KILL:
        return EventType.WORLD_KILL;
    }
  }

  private getPlayerOrThrow(
    playerMap: Map<string, Player>,
    name: string,
    ): Player {
    const player = playerMap.get(name);

    if (!player) {
        throw new Error(`Player not found in map: ${name}`);
    }

    return player;
  }
}
