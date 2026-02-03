import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { MatchPlayerAward } from '../match-player-awards/match-player-award.entity';

@Entity('awards')
export class Award {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @OneToMany(() => MatchPlayerAward, mpa => mpa.award)
  assignments: MatchPlayerAward[];
}
