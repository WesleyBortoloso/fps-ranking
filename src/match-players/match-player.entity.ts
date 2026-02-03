import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
  JoinColumn,
  Index,
} from 'typeorm';
import { Match } from '../matches/match.entity';
import { Player } from '../players/player.entity';
import { MatchPlayerAward } from '../match-player-awards/match-player-award.entity';

@Entity('match_players')
@Unique(['match', 'player'])
export class MatchPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, match => match.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_id' })
  @Index()
  match: Match;

  @ManyToOne(() => Player, player => player.matches)
  @JoinColumn({ name: 'player_id' })
  @Index()
  player: Player;

  @Column({ default: 0 })
  kills: number;

  @Column({ default: 0 })
  deaths: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  maxKillStreak: number;

  @OneToMany(() => MatchPlayerAward, mpa => mpa.matchPlayer)
  awards: MatchPlayerAward[];
}
