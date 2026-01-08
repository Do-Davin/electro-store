import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsUUID()
  categoryId: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(0)
  discountPercent?: number;
}
