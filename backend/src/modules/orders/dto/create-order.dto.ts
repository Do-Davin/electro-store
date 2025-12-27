import { IsArray, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsArray()
  items: {
    productId: string;
    quantity: number;
  }[];
}
