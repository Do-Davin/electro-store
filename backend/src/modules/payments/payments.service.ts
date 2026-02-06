import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      this.logger.warn(
        'STRIPE_SECRET_KEY not set – payment features will fail at runtime.',
      );
    }
    this.stripe = new Stripe(secretKey || '', {
      apiVersion: '2026-01-28.clover',
    });
  }

  /**
   * Create a Stripe PaymentIntent for an existing order.
   * Returns the clientSecret for frontend Stripe Elements.
   */
  async createPaymentIntent(orderId: string, userId: string) {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.user.id !== userId) {
      throw new ForbiddenException('You cannot pay for this order');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Order is ${order.status}. Only PENDING orders can be paid.`,
      );
    }

    // If order already has a PaymentIntent, return the existing clientSecret
    if (order.stripePaymentIntentId) {
      const existingIntent = await this.stripe.paymentIntents.retrieve(
        order.stripePaymentIntentId,
      );
      if (
        existingIntent.status !== 'canceled' &&
        existingIntent.status !== 'succeeded'
      ) {
        return { clientSecret: existingIntent.client_secret };
      }
    }

    const amount = Math.round(Number(order.totalAmount) * 100); // Stripe uses cents

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    });

    // Store the PaymentIntent ID on the order
    order.stripePaymentIntentId = paymentIntent.id;
    await this.ordersRepo.save(order);

    return { clientSecret: paymentIntent.client_secret };
  }

  /**
   * Verify a PaymentIntent's status with Stripe and update the order accordingly.
   * This is the synchronous complement to the webhook – useful when the
   * webhook hasn't arrived yet (e.g. local dev without Stripe CLI).
   */
  async verifyPayment(orderId: string, userId: string) {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.user.id !== userId) {
      throw new ForbiddenException('You cannot access this order');
    }

    // Already updated – just return the order
    if (order.status !== 'PENDING' || !order.stripePaymentIntentId) {
      return order;
    }

    // Ask Stripe for the real status
    const intent = await this.stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId,
    );

    if (intent.status === 'succeeded') {
      order.status = 'PAID';
      await this.ordersRepo.save(order);
      this.logger.log(`Order ${orderId} verified & marked as PAID`);
    }

    return order;
  }

  /**
   * Handle Stripe webhook events.
   * Called by the webhook controller with the raw body + signature.
   */
  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${(err as Error).message}`,
      );
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Received Stripe event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await this.handlePaymentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        this.logger.log(
          `Payment failed for order: ${paymentIntent.metadata?.orderId}`,
        );
        break;
      }

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Mark the order as PAID when payment succeeds.
   */
  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      this.logger.warn('PaymentIntent has no orderId in metadata');
      return;
    }

    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      this.logger.warn(`Order not found for PaymentIntent: ${orderId}`);
      return;
    }

    if (order.status !== 'PENDING') {
      this.logger.log(`Order ${orderId} is already ${order.status}, skipping.`);
      return;
    }

    order.status = 'PAID';
    order.stripePaymentIntentId = paymentIntent.id;
    await this.ordersRepo.save(order);

    this.logger.log(`Order ${orderId} marked as PAID`);
  }
}
