import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAdminUserDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  experience?: string;
}
