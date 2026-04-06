import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  accountId!: string;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column({ nullable: true })
  bankId!: string;

  @Column({ type: 'float', nullable: true })
  riskScore!: number;
}
