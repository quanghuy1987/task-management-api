import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { UsersModule } from '@src/user/user.module';
import { TaskController } from './task.controller';
import { CaslModule } from '@src/casl/casl.module';
import { CaslAbilityFactory } from '@src/casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, CaslModule],
  controllers: [TaskController],
  providers: [TaskService, CaslAbilityFactory],
  exports: [TaskService, CaslAbilityFactory],
})
export class TaskModule {}
