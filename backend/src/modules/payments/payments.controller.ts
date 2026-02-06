import {
  Controller,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Request as NestRequest,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthRequest } from '../auth/types/auth-request.type';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Create a Stripe PaymentIntent for the given order.
   * Returns { clientSecret: string } for frontend Stripe Elements.
   */
  @Post('create-intent/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createPaymentIntent(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @NestRequest() req: AuthRequest,
  ) {
    return this.paymentsService.createPaymentIntent(orderId, req.user.sub);
  }

  /**
   * Verify a payment with Stripe and update the order status.
   * Call this after confirmPayment() succeeds on the frontend.
   */
  @Post('verify/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  verifyPayment(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @NestRequest() req: AuthRequest,
  ) {
    return this.paymentsService.verifyPayment(orderId, req.user.sub);
  }

  /**
   * Stripe webhook endpoint – NO auth guard.
   * Stripe sends events here with a signature header.
   * Requires raw body for signature verification.
   */
  @Post('webhook')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  handleWebhook(@Req() req, @Headers('stripe-signature') signature: string) {
    // rawBody is attached by NestJS when { rawBody: true } is set in main.ts
    return this.paymentsService.handleWebhook(req.rawBody as Buffer, signature);
  }
}
