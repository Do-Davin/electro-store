import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request as NestRequest,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateOrderStatusDto } from './dto/update-status.dto';
import type { AuthRequest } from '../auth/types/auth-request.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@NestRequest() req: AuthRequest, @Body() dto: CreateOrderDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.ordersService.create(req.user.sub, dto); // req.user.sub = logged in user ID
  }

  @Patch(':id')
  @Roles('ADMIN')
  updateOrder(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @NestRequest() req: AuthRequest,
  ) {
    return this.ordersService.update(id, req.user.sub, req.user.role, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  removeOrder(@Param('id') id: string, @NestRequest() req: AuthRequest) {
    return this.ordersService.remove(id, req.user.sub, req.user.role);
  }

  @Get('me')
  findMyOrders(
    @NestRequest() req: AuthRequest,
    @Query() query: PaginationQueryDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.ordersService.findByUser(req.user.sub, query);
  }

  @Get(':id')
  findOneOrder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @NestRequest() req: AuthRequest,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.ordersService.findByIdForUser(id, req.user.sub);
  }

  @Get('admin/:id')
  @Roles('ADMIN')
  getOrder(@Param('id') id: string) {
    return this.ordersService.findByIdAdmin(id);
  }

  @Get()
  @Roles('ADMIN')
  findAllOrders(@Query() query: PaginationQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Post(':id/pay')
  payOrder(@Param('id') id: string, @NestRequest() req: AuthRequest) {
    return this.ordersService.pay(id, req.user.sub, req.user.role);
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
