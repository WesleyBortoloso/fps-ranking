import { Award } from "../awards/award.entity";
import { MatchPlayerAward } from "../match-player-awards/match-player-award.entity";
import { MatchPlayer } from "../match-players/match-player.entity";
import { Match } from "../matches/match.entity";
import { Player } from "../players/player.entity";
import { Event } from "../events/event.entity";

export const ENTITIES = [
  Match,
  Player,
  MatchPlayer,
  Event,
  Award,
  MatchPlayerAward,
];
