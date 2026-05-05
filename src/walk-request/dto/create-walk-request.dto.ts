import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWalkRequestDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  returnDate?: string;

  @IsOptional()
  @IsString()
  returnTime?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsNotEmpty()
  dogId: number;
}
