export interface ProcessedPlayer {
  name: string;
  kills: number;
  deaths: number;
  score: number;
  maxKillStreak: number;
}

export interface MatchProcessResult {
  players: ProcessedPlayer[];
  awards: Map<string, string[]>;
}
