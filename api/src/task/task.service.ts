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
    return this.taskRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        parent: true,
      },
    });
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
    const condition = {};
    if (user) {
      condition['user'] = {
        id: user.id,
      };
    } else {
      condition['parent'] = IsNull();
    }
    return this.taskRepository.find({
      where: condition,
      relations: {
        parent: true,
      },
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
        error: [{ user: 'assigned_user_not_found' }],
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
      error: null,
      data: taskAfterInsert,
    };
  }

  async update(
    updateTaskReq: UpdateTaskDto,
    task: Task,
  ): Promise<CommonReturn> {
    task.title = updateTaskReq.title;
    task.description = updateTaskReq.description ?? undefined;
    task.status = updateTaskReq.status;
    if (updateTaskReq.userId !== task.userId) {
      const assignUser = await this.userService.findActiveOne(
        updateTaskReq.userId,
      );
      if (assignUser) {
        task.user = assignUser;
      } else {
        return {
          error: [{ user: 'assigned_user_not_found' }],
          data: {},
        };
      }
    }
    task.save();
    return {
      error: null,
      data: task,
    };
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
