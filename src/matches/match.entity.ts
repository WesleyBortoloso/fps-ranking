import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { MatchPlayer } from '../match-players/match-player.entity';
import { Event } from '../events/event.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  externalId: number;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @OneToMany(() => MatchPlayer, mp => mp.match)
  players: MatchPlayer[];

  @OneToMany(() => Event, event => event.match)
  events: Event[];
}
