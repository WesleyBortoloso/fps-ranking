import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Match } from '../matches/match.entity';
import { Player } from '../players/player.entity';

export enum EventType {
  MATCH_START = 'MATCH_START',
  MATCH_END = 'MATCH_END',
  KILL = 'KILL',
  WORLD_KILL = 'WORLD_KILL',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, match => match.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_id' })
  @Index()
  match: Match;

  @Column()
  @Index()
  timestamp: Date;

  @Column({ type: 'simple-enum', enum: EventType })
  type: EventType;

  @ManyToOne(() => Player, { nullable: true })
  killer: Player | null;

  @ManyToOne(() => Player, { nullable: true })
  victim: Player | null;

  @Column({ type: 'text', nullable: true })
  weapon: string | null;
}
