import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { User } from '@src/user/user.entity';

@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: '220' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: '20' })
  status: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @RelationId((task: Task) => task.user)
  userId: number;

  @ManyToOne(() => Task, (task) => task.subTasks, { nullable: true })
  parent?: Task;

  @OneToMany(() => Task, (task) => task.parent)
  @JoinColumn({ name: 'parentId' })
  subTasks: Task[];

  @CreateDateColumn({ type: 'datetime', default: () => 'NOW()' })
  createdAt: string;

  @UpdateDateColumn({ type: 'datetime', default: () => 'NOW()' })
  updatedAt: string;
}
