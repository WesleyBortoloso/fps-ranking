export enum LogEventType {
  MATCH_START = 'MATCH_START',
  MATCH_END = 'MATCH_END',
  KILL = 'KILL',
  WORLD_KILL = 'WORLD_KILL',
}

export interface LogEvent {
  timestamp: Date;
  type: LogEventType;
  matchId?: number;
  killer?: string;
  victim?: string;
  weapon?: string;
}
