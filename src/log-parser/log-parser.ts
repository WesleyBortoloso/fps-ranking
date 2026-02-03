import { LogEvent, LogEventType } from './log-event.interface';

export class LogParser {
  parse(line: string): LogEvent | null {
    const [datePart, message] = line.split(' - ');

    if (!datePart || !message) return null;

    const timestamp = this.parseTimestamp(datePart);

    const matchStart = message.match(/New match (\d+) has started/);
    if (matchStart) {
      return {
        timestamp,
        type: LogEventType.MATCH_START,
        matchId: Number(matchStart[1]),
      };
    }

    const matchEnd = message.match(/Match (\d+) has ended/);
    if (matchEnd) {
      return {
        timestamp,
        type: LogEventType.MATCH_END,
        matchId: Number(matchEnd[1]),
      };
    }

    const worldKill = message.match(/<WORLD> killed (.+) by (.+)/);
    if (worldKill) {
      return {
        timestamp,
        type: LogEventType.WORLD_KILL,
        killer: '<WORLD>',
        victim: worldKill[1],
        weapon: worldKill[2],
      };
    }

    const kill = message.match(/(.+) killed (.+) using (.+)/);
    if (kill) {
      return {
        timestamp,
        type: LogEventType.KILL,
        killer: kill[1],
        victim: kill[2],
        weapon: kill[3],
      };
    }

    return null;
  }

  private parseTimestamp(datePart: string): Date {
    const [date, time] = datePart.split(' ');
    const [day, month, year] = date.split('/').map(Number);
    const [hour, minute, second] = time.split(':').map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
    }
}
