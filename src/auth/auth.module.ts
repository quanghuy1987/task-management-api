import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '@src/user/user.service';
import { UsersModule } from '@src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  controllers: [AuthController],
  providers: [UserService],
  exports: [UserService],
})
export class AuthModule {}
