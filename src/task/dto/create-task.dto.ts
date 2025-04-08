import { IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '@src/enum';

export class CreateTaskDto {
  @MaxLength(220, {
    message: 'must_be_less_than_220',
  })
  title: string;

  description?: string;

  @IsEnum(TaskStatus, {
    message: 'invalid_status',
  })
  status: string;

  userId: number;
  taskId?: string;
}
