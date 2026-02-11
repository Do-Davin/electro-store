import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  items: OrderItem[];

  @Column('decimal', { default: 0 })
  shippingAmount: number;

  @Column('decimal')
  totalAmount: number;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: OrderStatus;

  @Column({ type: 'varchar', nullable: true })
  stripeSessionId: string;

  @Column({ type: 'varchar', nullable: true })
  stripePaymentIntentId: string;

  @CreateDateColumn()
  createdAt: Date;
}
