import { LogEvent, LogEventType } from '../../log-parser/log-event.interface';
import { MatchProcessResult } from './match-processor.types';

interface PlayerState {
  kills: number;
  deaths: number;
  score: number;
  currentStreak: number;
  maxKillStreak: number;
}

export class MatchProcessorService {
  process(events: LogEvent[]): MatchProcessResult {
    let matchId: number | undefined;
    const players = new Map<string, PlayerState>();
    const awards = new Map<string, string[]>();
    const killWindows = new Map<string, Date[]>();

    const addAward = (player: string, award: string) => {
      if (!awards.has(player)) {
        awards.set(player, []);
      }

      if (!awards.get(player)!.includes(award)) {
        awards.get(player)!.push(award);
      }
    };

    const getPlayer = (name: string): PlayerState => {
      if (!players.has(name)) {
        players.set(name, {
          kills: 0,
          deaths: 0,
          score: 0,
          currentStreak: 0,
          maxKillStreak: 0,
        });
      }
      return players.get(name)!;
    };

    for (const event of events) {
      switch (event.type) {
        case LogEventType.MATCH_START:
          matchId = event.matchId;
          break;

        case LogEventType.KILL: {
          const killerName = event.killer!;
          const victimName = event.victim!;
          const timestamp = event.timestamp;

          const killer = getPlayer(killerName);
          const victim = getPlayer(victimName);

          killer.kills++;
          killer.score++;
          killer.currentStreak++;
          killer.maxKillStreak = Math.max(
            killer.maxKillStreak,
            killer.currentStreak,
          );

          victim.deaths++;
          victim.currentStreak = 0;

          const list = killWindows.get(killerName) ?? [];
          list.push(timestamp);

          const oneMinuteAgo = new Date(timestamp.getTime() - 60_000);
          const recentKills = list.filter(t => t >= oneMinuteAgo);

          killWindows.set(killerName, recentKills);

          if (recentKills.length === 5) {
            addAward(killerName, 'SpeedKillerAward');
          }

          break;
        }

        case LogEventType.WORLD_KILL: {
          const victim = getPlayer(event.victim!);
          victim.deaths++;
          victim.currentStreak = 0;
          break;
        }
      }
    }

    for (const [playerName, stats] of players) {
      if (stats.deaths === 0 && stats.kills > 0) {
        addAward(playerName, 'NoDeathAward');
      }
    }

    return {
      players: Array.from(players.entries()).map(([name, stats]) => ({
        name,
        kills: stats.kills,
        deaths: stats.deaths,
        score: stats.score,
        maxKillStreak: stats.maxKillStreak,
      })),
      awards,
    };
  }
}
