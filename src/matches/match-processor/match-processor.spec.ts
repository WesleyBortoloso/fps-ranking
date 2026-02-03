import { MatchProcessorService } from './match-processor.service';
import { LogEventType } from '../../log-parser/log-event.interface';

describe('MatchProcessorService', () => {
  it('should process a full match correctly', () => {
    const service = new MatchProcessorService();

    const events = [
      {
        type: LogEventType.MATCH_START,
        matchId: 1,
        timestamp: new Date(),
      },
      {
        type: LogEventType.KILL,
        killer: 'Roman',
        victim: 'Nick',
        weapon: 'M16',
        timestamp: new Date(),
      },
      {
        type: LogEventType.WORLD_KILL,
        killer: '<WORLD>',
        victim: 'Nick',
        weapon: 'DROWN',
        timestamp: new Date(),
      },
    ];

    const result = service.process(events);
    const roman = result.players.find(p => p.name === 'Roman')!;
    const nick = result.players.find(p => p.name === 'Nick')!;

    expect(roman.kills).toBe(1);
    expect(roman.deaths).toBe(0);
    expect(roman.score).toBe(1);
    expect(roman.maxKillStreak).toBe(1);

    expect(nick.kills).toBe(0);
    expect(nick.deaths).toBe(2);
    expect(nick.score).toBe(0);
  });
});
