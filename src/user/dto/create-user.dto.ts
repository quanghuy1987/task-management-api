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
  @IsEmail()
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
      message:
        'Password must contain at least 1 uppercase, 1 lowercase, 1 special character, 1 number',
    },
  )
  password: string;
}
