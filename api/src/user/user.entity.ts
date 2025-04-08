import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { USER_ROLE } from '@src/constants';
import { Task } from '@src/task/task.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: '60' })
  name: string;

  @Column({ type: 'varchar', length: '60' })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: '100' })
  password: string;

  @Column({ type: 'varchar', length: '100', nullable: true })
  refreshToken: string;

  @Column({ type: 'varchar', length: '100', default: USER_ROLE })
  role: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'NOW()' })
  createdAt: string;

  @UpdateDateColumn({ type: 'datetime', default: () => 'NOW()' })
  updatedAt: string;

  @Column({ type: 'datetime', default: () => 'NOW()' })
  emailVerifiedAt: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
