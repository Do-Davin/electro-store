import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

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

  async create(dto: CreateOrderDto) {
    const user = await this.usersRepo.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    const items: OrderItem[] = [];

    let total = 0;

    for (const it of dto.items) {
      const product = await this.productsRepo.findOneBy({ id: it.productId });
      if (!product) throw new NotFoundException('Product not found');

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

  findAll() {
    return this.ordersRepo.find();
  }

  findOne(id: string) {
    return this.ordersRepo.findOneBy({ id });
  }
}
