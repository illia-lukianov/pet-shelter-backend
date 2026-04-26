import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Wrong email format.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 symbols.' })
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}