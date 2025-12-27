import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAllOrders() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOneOrder(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
