import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CommonReturn } from '@src/return/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { encrypt, decrypt } from '@src/encryption';
import * as moment from 'moment';
import { EmailService } from '@src/mail/email.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  findActiveOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email, isActive: true });
  }

  findActiveOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id, isActive: true });
  }

  async create(createUserReq: CreateUserDto): Promise<CommonReturn> {
    const checkExist = await this.findActiveOneByEmail(createUserReq.email);

    if (checkExist) {
      return {
        error: 'duplicate_email',
        data: {},
      };
    }
    const user = this.usersRepository.create(createUserReq);
    user.save();
    const token = encrypt({
      email: user.email,
      expiredIn: moment().add(12, 'hours').unix(),
    });
    this.emailService.sendUserWelcome(user, token);
    return {
      error: '',
      data: user,
    };
  }

  async login(userLoginReq: LoginUserDto): Promise<CommonReturn> {
    const user = await this.findActiveOneByEmail(userLoginReq.email);

    if (!user) {
      return {
        error: 'invalid_credentials',
        data: {},
      };
    }
    if (!bcrypt.compareSync(userLoginReq.password, user.password)) {
      return {
        error: 'invalid_credentials',
        data: {},
      };
    }

    if (!user.emailVerifiedAt) {
      return {
        error: 'user_not_verify_email',
        data: {},
      };
    }
    const payload = {
      sub: user.id,
      email: user.email,
      refresh_token: encrypt(user.refreshToken),
    };

    return {
      error: '',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: await this.jwtService.signAsync({
          refresh_token: user.refreshToken,
        }),
      },
    };
  }

  async verifyEmail(verifyUserReq: VerifyUserDto): Promise<CommonReturn> {
    const decryptData = decrypt(verifyUserReq.token);
    const user = await this.findActiveOneByEmail(decryptData.email);
    if (!user) {
      return {
        error: 'invalid_key',
        data: {},
      };
    }

    if (user.emailVerifiedAt) {
      return {
        error: 'email_already_verified',
        data: {},
      };
    }

    if (parseInt(decryptData.expiredIn) < moment().unix()) {
      return {
        error: 'key_expired',
        data: {},
      };
    }

    user.emailVerifiedAt = moment().toISOString(true);
    user.refreshToken = await this.generateRefreshToken(uuidV4());

    user.save();

    return {
      error: '',
      data: user,
    };
  }

  async generateRefreshToken(refreshToken: string): Promise<string> {
    const checkExistToken = await this.usersRepository.findOneBy({
      refreshToken: refreshToken,
      isActive: true,
    });

    if (checkExistToken) {
      return await this.generateRefreshToken(uuidV4());
    }
    return refreshToken;
  }
}
