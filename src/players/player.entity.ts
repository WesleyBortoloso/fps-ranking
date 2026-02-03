import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { MatchPlayer } from '../match-players/match-player.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  name: string;

  @OneToMany(() => MatchPlayer, mp => mp.player)
  matches: MatchPlayer[];
}
