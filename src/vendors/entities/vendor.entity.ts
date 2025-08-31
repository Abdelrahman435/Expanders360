import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Match } from '../../matches/entities/match.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('json')
  countries_supported: string[];

  @Column('json')
  services_offered: string[];

  @Column('decimal', { precision: 3, scale: 2 })
  rating: number;

  @Column()
  response_sla_hours: number;

  @Column({ type: 'date', nullable: true })
  sla_expiry_date: Date;

  @OneToMany(() => Match, (match) => match.vendor)
  matches: Match[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
