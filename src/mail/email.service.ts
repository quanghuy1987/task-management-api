import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserWelcome(user: User, token: string) {
    const confirmation_url = `${this.configService.get('APP_URL')}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to App! Confirm your Email',
      template: './verify-email', // `.ejs` extension is appended automatically
      context: {
        name: user.name,
        confirmation_url,
      },
    });
  }
}
