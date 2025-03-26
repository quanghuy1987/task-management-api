import { IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '@src/enum';

export class UpdateTaskDto {
  @MaxLength(220)
  title: string;

  description?: string;

  @IsEnum(TaskStatus)
  status: string;
}
