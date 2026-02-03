import { LogParser } from './log-parser';
import { LogEventType } from './log-event.interface';

describe('LogParser', () => {
  let parser: LogParser;

  beforeEach(() => {
    parser = new LogParser();
  });

  it('should parse match start event', () => {
    const line = '23/04/2019 15:34:22 - New match 11348965 has started';

    const event = parser.parse(line)!;

    expect(event.type).toBe(LogEventType.MATCH_START);
    expect(event.matchId).toBe(11348965);
    expect(event.timestamp.getTime()).toBe(
        new Date(2019, 3, 23, 15, 34, 22).getTime()
    );
  });


  it('should parse match end event', () => {
    const line = '23/04/2019 15:39:22 - Match 11348965 has ended';

    const event = parser.parse(line);

    expect(event?.type).toBe(LogEventType.MATCH_END);
    expect(event?.matchId).toBe(11348965);
  });

  it('should parse player kill event', () => {
    const line = '23/04/2019 15:36:04 - Roman killed Nick using M16';

    const event = parser.parse(line)!;

    expect(event.type).toBe(LogEventType.KILL);
    expect(event.killer).toBe('Roman');
    expect(event.victim).toBe('Nick');
    expect(event.weapon).toBe('M16');
    expect(event.timestamp.getTime()).toBe(
      new Date(2019, 3, 23, 15, 36, 4).getTime()
    );
  });

  it('should parse world kill event', () => {
    const line = '23/04/2019 15:36:33 - <WORLD> killed Nick by DROWN';

    const event = parser.parse(line)!;

    expect(event.type).toBe(LogEventType.WORLD_KILL);
    expect(event.killer).toBe('<WORLD>');
    expect(event.victim).toBe('Nick');
    expect(event.weapon).toBe('DROWN');
    expect(event.timestamp.getTime()).toBe(
      new Date(2019, 3, 23, 15, 36, 33).getTime()
    );
  });

  it('should return null for invalid line', () => {
    const line = 'invalid log line';

    const event = parser.parse(line);

    expect(event).toBeNull();
  });
});
