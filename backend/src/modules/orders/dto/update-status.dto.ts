import { IsIn } from 'class-validator';
import type { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @IsIn(['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'])
  status: OrderStatus;
}
