export interface MatchResult {
  matchId: number;
  players: {
    name: string;
    kills: number;
    deaths: number;
    score: number;
    maxKillStreak: number;
  }[];
}
