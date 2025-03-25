import { IsString, IsEmail, MaxLength } from 'class-validator';

export class LoginUserDto {
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
