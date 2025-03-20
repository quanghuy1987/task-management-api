import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '60' })
  name: string;

  @Column({ type: 'varchar', length: '60' })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: '100' })
  password: string;

  @Column({ type: 'datetime' })
  createdAt: string;

  @Column({ type: 'datetime' })
  updatedAt: string;

  @Column({ type: 'datetime', nullable: true })
  emailVerifiedAt: string;
}
