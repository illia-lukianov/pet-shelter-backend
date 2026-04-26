import { IsString, IsEmail, IsNotEmpty, IsOptional, IsInt, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdoptionDto {
  @IsString()
  @IsNotEmpty({ message: "Прізвище та ім'я обов'язкові" })
  fullName: string;

  @IsEmail({}, { message: 'Некоректний формат email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Номер телефону обов’язковий' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Опишіть ваш досвід детальніше (мін. 10 символів)',
  })
  experience: string;

  @IsString()
  @IsOptional()
  message?: string;

  @Type(() => Number)
  @IsInt()
  dogId: number;
}