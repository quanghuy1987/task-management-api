import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserService } from '@src/user/user.service';
import { CommonReturn } from '@src/return/common';
import { User } from '@src/user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private userService: UserService,
  ) {}

  findOne(id: number): Promise<Task | null> {
    return this.taskRepository.findOneBy({ id });
  }
  getAllByTaskId(id: number, user?: User): Promise<Task[]> {
    const condition = {
      parent: {
        id: id,
      },
    };
    if (user) {
      condition['user'] = {
        id: user.id,
      };
    }
    return this.taskRepository.find({
      where: condition,
    });
  }

  getAllByUser(user?: User): Promise<Task[]> {
    const condition = {
      parent: IsNull(),
    };
    if (user) {
      condition['user'] = {
        id: user.id,
      };
    }
    return this.taskRepository.find({
      where: condition,
    });
  }

  async create(createTaskReq: CreateTaskDto): Promise<CommonReturn> {
    const task = this.taskRepository.create(createTaskReq);
    const assignUser = await this.userService.findActiveOne(
      createTaskReq.userId,
    );
    if (assignUser) {
      task.user = assignUser;
    } else {
      return {
        error: 'assigned_user_not_found',
        data: {},
      };
    }

    if (createTaskReq.taskId) {
      task.parent =
        (await this.taskRepository.findOneBy({
          id: parseInt(createTaskReq.taskId),
        })) ?? undefined;
    }
    const taskAfterInsert = {
      ...(await this.taskRepository.insert(task)).generatedMaps[0],
      ...task,
    };
    return {
      error: '',
      data: taskAfterInsert,
    };
  }

  update(updateTaskReq: UpdateTaskDto, task: Task): Task {
    task.title = updateTaskReq.title;
    task.description = updateTaskReq.description ?? undefined;
    task.status = updateTaskReq.status;
    task.save();
    return task;
  }

  delete(id: number): boolean {
    const queryBuilder = this.taskRepository.createQueryBuilder();
    queryBuilder
      .delete()
      .where('parent = :parentId', { parentId: id })
      .execute();
    const queryBuilderNew = this.taskRepository.createQueryBuilder();
    queryBuilderNew.delete().where('id = :id', { id: id }).execute();
    return true;
  }
}
