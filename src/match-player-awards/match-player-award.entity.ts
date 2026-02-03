import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  Index,
} from 'typeorm';
import { MatchPlayer } from '../match-players/match-player.entity';
import { Award } from '../awards/award.entity';

@Entity('match_player_awards')
@Unique(['matchPlayer', 'award'])
export class MatchPlayerAward {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MatchPlayer, mp => mp.awards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_player_id' })
  @Index()
  matchPlayer: MatchPlayer;

  @ManyToOne(() => Award, award => award.assignments)
  award: Award;
}
