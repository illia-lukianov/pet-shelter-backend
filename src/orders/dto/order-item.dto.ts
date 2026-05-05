import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class OrderItemDto {
  @Type(() => Number)
  @IsInt()
  productId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
