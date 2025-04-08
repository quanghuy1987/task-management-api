import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailModule } from '@src/mail/email.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@src/constants';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@src/mail/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    EmailModule,
  ],
  providers: [UserService, JwtService, EmailService],
  exports: [UserService],
})
export class UsersModule {}
