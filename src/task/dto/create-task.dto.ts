import { IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '@src/enum';

export class CreateTaskDto {
  @MaxLength(220)
  title: string;

  description?: string;

  @IsEnum(TaskStatus)
  status: string;

  userId: string;
  taskId?: string;
}
