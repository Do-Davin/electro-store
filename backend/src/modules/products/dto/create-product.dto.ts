import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsUUID()
  categoryId: string;
}
