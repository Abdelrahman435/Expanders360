import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Match } from '../../matches/entities/match.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  client_id: number;

  @Column({ length: 100 })
  country: string;

  @Column('json')
  services_needed: string[];

  @Column('decimal', { precision: 15, scale: 2 })
  budget: number;

  @Column({
    type: 'enum',
    enum: ['active', 'pending', 'completed', 'cancelled'],
    default: 'active',
  })
  status: string;

  @Column({ default: false })
  is_expansion_project: boolean;

  @OneToMany(() => Match, (match) => match.project)
  matches: Match[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
