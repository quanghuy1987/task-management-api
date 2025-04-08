import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Not, Repository } from 'typeorm';
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

  findAllActiveNotAdmin(): Promise<User[]> {
    return this.usersRepository.findBy({ isActive: true, role: Not('admin') });
  }

  async create(createUserReq: CreateUserDto): Promise<CommonReturn> {
    const checkExist = await this.findActiveOneByEmail(createUserReq.email);

    if (checkExist) {
      return {
        error: [
          {
            email: 'email_exists',
          },
        ],
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
      error: null,
      data: user,
    };
  }

  async login(userLoginReq: LoginUserDto): Promise<CommonReturn> {
    const user = await this.findActiveOneByEmail(userLoginReq.email);

    if (!user) {
      return {
        error: [{ email: 'invalid_credentials' }],
        data: {},
      };
    }
    if (!bcrypt.compareSync(userLoginReq.password, user.password)) {
      return {
        error: [{ email: 'invalid_credentials' }],
        data: {},
      };
    }

    if (!user.emailVerifiedAt) {
      return {
        error: [{ email: 'user_not_verify_email' }],
        data: {},
      };
    }
    const payload = {
      sub: user.id,
      email: user.email,
      refresh_token: encrypt(user.refreshToken),
    };

    return {
      error: null,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync({
          refreshToken: user.refreshToken,
        }),
      },
    };
  }

  async verifyEmail(verifyUserReq: VerifyUserDto): Promise<CommonReturn> {
    const decryptData = decrypt(verifyUserReq.token);
    const user = await this.findActiveOneByEmail(decryptData.email);
    if (!user) {
      return {
        error: [{ token: 'invalid_token_key' }],
        data: {},
      };
    }

    if (user.emailVerifiedAt) {
      return {
        error: [{ email: 'email_already_verified' }],
        data: {},
      };
    }

    if (parseInt(decryptData.expiredIn) < moment().unix()) {
      return {
        error: [{ token: 'token_key_expired' }],
        data: {},
      };
    }

    user.emailVerifiedAt = moment().toISOString(true);
    user.refreshToken = await this.generateRefreshToken(uuidV4());

    user.save();

    return {
      error: null,
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
