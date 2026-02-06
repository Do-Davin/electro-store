import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // First pass: validate all products exist and have sufficient stock
    const productMap = new Map<string, Product>();
    for (const it of dto.items) {
      const product = await this.productsRepo.findOneBy({ id: it.productId });
      if (!product) {
        throw new NotFoundException(`Product not found: ${it.productId}`);
      }
      if (product.stock < it.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${it.quantity}`,
        );
      }
      productMap.set(it.productId, product);
    }

    // Second pass: create order items and deduct stock
    const items: OrderItem[] = [];
    let total = 0;

    for (const it of dto.items) {
      const product = productMap.get(it.productId)!;

      // Deduct stock
      product.stock -= it.quantity;
      await this.productsRepo.save(product);

      const item = this.orderItemsRepo.create({
        product,
        quantity: it.quantity,
        priceAtTime: product.price,
      });

      total += Number(product.price) * it.quantity;
      items.push(item);
    }

    const order = this.ordersRepo.create({
      user,
      items,
      totalAmount: total,
      status: 'PENDING',
    });

    return this.ordersRepo.save(order);
  }

  async findByUser(userId: string, { page, limit }: PaginationQueryDto) {
    const [data, total] = await this.ordersRepo.findAndCount({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByIdForUser(orderId: string, userId: string) {
    const order = await this.ordersRepo.findOne({
      // Give me this order ONLY IF it belongs to this user.
      where: { id: orderId, user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll({ page, limit }: PaginationQueryDto) {
    const [data, total] = await this.ordersRepo.findAndCount({
      relations: ['user', 'items', 'items.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findByIdAdmin(id: string) {
    return this.ordersRepo.findOneBy({ id });
  }

  async update(
    orderId: string,
    userId: string,
    role: 'USER' | 'ADMIN',
    dto: UpdateOrderDto,
  ) {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    // if not admin and not owner → forbidden
    if (role !== 'ADMIN' && order.user.id !== userId) {
      throw new ForbiddenException('You cannot modify this order');
    }

    if (dto.items && dto.items.length > 0) {
      const newItems: OrderItem[] = [];
      let newTotal = 0;

      for (const it of dto.items) {
        const product = await this.productsRepo.findOneBy({ id: it.productId });
        if (!product) throw new NotFoundException('Product not found');

        const item = this.orderItemsRepo.create({
          product,
          quantity: it.quantity,
          priceAtTime: product.price,
        });

        newTotal += Number(product.price) * it.quantity;
        newItems.push(item);
      }

      order.items = newItems;
      order.totalAmount = newTotal;
    }

    const { items: _unusedItems, ...rest } = dto;
    void _unusedItems; // prevents unused-var warning
    Object.assign(order, rest);

    return this.ordersRepo.save(order);
  }

  async remove(orderId: string, userId: string, role: 'USER' | 'ADMIN') {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    if (role !== 'ADMIN' && order.user.id !== userId) {
      throw new ForbiddenException('You cannot delete this order');
    }

    // Restore stock for orders that haven't been shipped yet
    const unshippedStatuses: OrderStatus[] = ['PENDING', 'PAID', 'PROCESSING'];
    if (unshippedStatuses.includes(order.status)) {
      await this.restoreStock(order.items);
    }

    await this.ordersRepo.remove(order);
    return { message: 'Order deleted successfully' };
  }

  async pay(orderId: string, userId: string, role: 'USER' | 'ADMIN') {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) throw new NotFoundException('Order not found');

    if (role !== 'ADMIN' && order.user.id !== userId) {
      throw new ForbiddenException('You cannot pay this order');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING orders can be paid');
    }

    order.status = 'PAID';
    return this.ordersRepo.save(order);
  }

  async cancel(orderId: string, userId: string, role: 'USER' | 'ADMIN') {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    if (role !== 'ADMIN' && order.user.id !== userId) {
      throw new ForbiddenException('You cannot cancel this order');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Order is already cancelled');
    }

    // Orders can only be cancelled if not yet shipped
    const cancellableStatuses: OrderStatus[] = [
      'PENDING',
      'PAID',
      'PROCESSING',
    ];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel order with status: ${order.status}`,
      );
    }

    // Use updateStatus to properly handle stock restoration
    return this.updateStatus(orderId, 'CANCELLED');
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const previousStatus = order.status;

    // Restore stock when changing to CANCELLED from unshipped status
    const unshippedStatuses: OrderStatus[] = ['PENDING', 'PAID', 'PROCESSING'];
    if (
      status === 'CANCELLED' &&
      previousStatus !== 'CANCELLED' &&
      unshippedStatuses.includes(previousStatus)
    ) {
      await this.restoreStock(order.items);
    }

    order.status = status;
    return this.ordersRepo.save(order);
  }

  /**
   * Helper: restore stock for order items
   */
  private async restoreStock(items: OrderItem[]) {
    for (const item of items) {
      const product = await this.productsRepo.findOneBy({
        id: item.product.id,
      });
      if (product) {
        product.stock += item.quantity;
        await this.productsRepo.save(product);
      }
    }
  }
}
