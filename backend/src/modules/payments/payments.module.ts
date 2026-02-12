import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaywayController } from './payway.controller';
import { PaywayService } from './payway.service';
import { Order } from '../orders/entities/order.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), OrdersModule],
  controllers: [PaymentsController, PaywayController],
  providers: [PaymentsService, PaywayService],
})
export class PaymentsModule {}
