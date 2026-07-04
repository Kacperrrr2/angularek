import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contradiction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  problemDescription!: string;

  @Column('jsonb')
  principles: unknown;

  @Column('text')
  advice!: string;

  @Column('int', { nullable: true })
  rating!: number | null;

  @CreateDateColumn()
  createdAt!: Date;
}
