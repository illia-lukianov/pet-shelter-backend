import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAccessoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  description?: string;

  @Type(() => Number)
  @IsPositive()
  price: number;

  @Type(() => Number)
  @Min(0)
  stock: number;

  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}
