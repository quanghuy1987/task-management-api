import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  Put,
  Param,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/')
  async create(@Body() createTaskdto: CreateTaskDto, @Res() res: Response) {
    const { data: task } = await this.taskService.create(createTaskdto);
    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        user: {
          id: task.user.id,
          name: task.user.name,
        },
      },
    });
  }

  @Get('/:id')
  async getDetail(@Param('id') id: string, @Res() res: Response) {
    const task = await this.taskService.findOne(parseInt(id));
    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'task_not_found',
      });
    }
    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const task = await this.taskService.findOne(parseInt(id));
    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'task_not_found',
      });
    }
    this.taskService.update(updateTaskDto, task);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'task_successfully_update',
    });
  }

  @Post('/:id/subtasks')
  async createSubTask(
    @Param('id') id: string,
    @Body() createTaskdto: CreateTaskDto,
    @Res() res: Response,
  ) {
    const task = await this.taskService.findOne(parseInt(id));
    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'task_not_found',
      });
    }
    createTaskdto.taskId = id;
    const { data: subTask } = await this.taskService.create(createTaskdto);
    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        id: subTask.id,
        title: subTask.title,
        description: subTask.description,
        status: subTask.status,
        createdAt: subTask.createdAt,
        updatedAt: subTask.updatedAt,
        user: {
          id: subTask.user.id,
          name: subTask.user.name,
        },
      },
    });
  }

  @Get('/:id/subtasks')
  async getAllSubTasks(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const task = await this.taskService.findOne(parseInt(id));
    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'task_not_found',
      });
    }
    const user = req['user'];
    const allSubTasks = await this.taskService.getAllByTaskId(
      parseInt(id),
      user,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      data: allSubTasks,
    });
  }
}
