import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Gender, DogStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateDogDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  traitIds?: number[];

  @IsString()
  @IsOptional()
  description: string;

  @Type(() => Number)
  @IsInt()
  breedId: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsEnum(DogStatus)
  @IsOptional()
  status?: DogStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  weight?: number;
}