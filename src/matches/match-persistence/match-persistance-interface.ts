import { LogEvent } from "../../log-parser/log-event.interface";
import { MatchProcessResult } from '../match-processor/match-processor.types';

export interface PersistMatchInput {
  matchId: number;
  events: LogEvent[];
  result: MatchProcessResult;
}
