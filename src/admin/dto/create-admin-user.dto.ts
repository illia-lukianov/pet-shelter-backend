import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateAdminUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  experience?: string;
}
