import { Injectable } from "@nestjs/common";
import { LogEvent, LogEventType } from "../log-parser/log-event.interface";
import { LogParser } from "../log-parser/log-parser";
import { MatchPersistenceService } from "../matches/match-persistence/match-persistence.service";
import { MatchProcessorService } from "../matches/match-processor/match-processor.service";

@Injectable()
export class LoggsService {
  constructor(
    private readonly parser: LogParser,
    private readonly processor: MatchProcessorService,
    private readonly persistence: MatchPersistenceService,
  ) {}

  async processLogFile(file: Express.Multer.File) {
    const lines = file.buffer.toString().split('\n');

    const events = lines
      .map(line => this.parser.parse(line))
      .filter(this.isLogEvent);

    const eventsByMatch = this.groupByMatch(events);

    for (const [matchId, matchEvents] of eventsByMatch) {
      const result = this.processor.process(matchEvents);

      await this.persistence.persist({
        matchId,
        events: matchEvents,
        result,
      });
    }

    return {
      matchesProcessed: eventsByMatch.size,
    };
  }

  private groupByMatch(events: LogEvent[]) {
    const map = new Map<number, LogEvent[]>();

    let currentMatchId: number | null = null;

    for (const event of events) {
      if (event.type === LogEventType.MATCH_START) {
        currentMatchId = event.matchId!;
        map.set(currentMatchId, []);
      }

      if (currentMatchId !== null) {
        map.get(currentMatchId)!.push(event);
      }

      if (event.type === LogEventType.MATCH_END) {
        currentMatchId = null;
      }
    }

    return map;
  }
  
  private isLogEvent(event: LogEvent | null): event is LogEvent {
    return event !== null;
  }
}
