import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from '@src/user/dto/create-user.dto';
import { UserService } from '@src/user/user.service';
import { LoginUserDto } from '@src/user/dto/login-user.dto';
import { VerifyUserDto } from '@src/user/dto/verify-user.dto';
import { Public } from '@src/decorator/public-metadata.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @Public()
  async register(@Body() createUserReq: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(createUserReq);

    if (!user.error) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'user_register_successfully',
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: user.error,
      });
    }
  }

  @Post('/login')
  @Public()
  async login(@Body() userLoginReq: LoginUserDto, @Res() res: Response) {
    const user = await this.userService.login(userLoginReq);
    if (!user.error) {
      return res.status(HttpStatus.OK).json({
        success: true,
        user: user.data,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: user.error,
      });
    }
  }

  @Post('/confirm')
  @Public()
  async verifyEmail(
    @Body() verifyUserReq: VerifyUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.verifyEmail(verifyUserReq);
    if (!user.error) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'email_verified_successfully',
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: user.error,
      });
    }
  }

  @Get('/me')
  getUserDetail(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  @Get('/users')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    const users = await this.userService.findAllActiveNotAdmin();
    return res.status(HttpStatus.OK).json({
      success: true,
      data: users,
    });
  }
}
