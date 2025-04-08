import {
  IsStrongPassword,
  IsString,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @MaxLength(50)
  name: string;

  @MaxLength(50)
  @IsEmail(
    {},
    {
      message: 'email_invalid_format',
    },
  )
  email: string;

  @IsString()
  @MaxLength(20)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: 'password_error_validation',
    },
  )
  password: string;
}
