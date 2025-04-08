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
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CaslAbilityFactory } from '@src/casl/casl-ability.factory';
import { Action } from '@src/enum';
import { ADMIN_ROLE } from '@src/constants';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  async getAllTasks(@Req() req: Request, @Res() res: Response) {
    let user = req['user'];
    user = user.role === ADMIN_ROLE ? null : user;
    const allSubTasks = await this.taskService.getAllByUser(user);
    return res.status(HttpStatus.OK).json({
      success: true,
      data: allSubTasks,
    });
  }

  @Post('/')
  async create(
    @Body() createTaskdto: CreateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req['user'];
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Create, 'all')) {
      throw new UnauthorizedException();
    }

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
  async getDetail(
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
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Read, task)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'you_are_not_allowed_to_take_this_action',
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId,
        parent: task.parent
          ? {
              id: task.parent.id,
              title: task.parent.title,
            }
          : null,
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
    const user = req['user'];
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Update, task)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'you_are_not_allowed_to_take_this_action',
      });
    }
    const response = await this.taskService.update(updateTaskDto, task);
    if (!response.error) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'task_successfully_update',
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: response.error,
      });
    }
  }

  @Post('/:id/subtasks')
  async createSubTask(
    @Param('id') id: string,
    @Req() req: Request,
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
    const user = req['user'];
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Create, task)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'you_are_not_allowed_to_take_this_action',
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
    let user = req['user'];
    user = user.role === ADMIN_ROLE ? null : user;
    const allSubTasks = await this.taskService.getAllByTaskId(
      parseInt(id),
      user,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      data: allSubTasks,
    });
  }

  @Delete('/:id')
  async delete(
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
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Delete, task)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'you_are_not_allowed_to_take_this_action',
      });
    }
    this.taskService.delete(parseInt(id));
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'successfully_delete',
      data: null,
    });
  }
}
