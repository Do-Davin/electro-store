import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request as NestRequest,
  UseGuards,
} from '@nestjs/common';
import { PaywayService } from './payway.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthRequest } from '../auth/types/auth-request.type';

@Controller('payments/payway')
export class PaywayController {
  constructor(private readonly paywayService: PaywayService) {}

  /**
   * Create a PayWay transaction for the given order.
   * Returns { tranId, checkoutHtml } — frontend renders the HTML in a popup.
   */
  @Post('create/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createTransaction(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @NestRequest() req: AuthRequest,
    @Query('currency') currency?: 'USD' | 'KHR',
    @Query('payment_option') paymentOption?: string,
  ) {
    return this.paywayService.createTransaction(
      orderId,
      req.user.sub,
      currency || 'USD',
      paymentOption,
    );
  }

  /**
   * PayWay callback endpoint — NO auth guard.
   * PayWay POSTs here with { tran_id, apv, status, return_params }.
   */
  @Post('callback')
  handleCallback(
    @Body()
    body: {
      tran_id: string;
      apv?: string;
      status: string;
      return_params?: string;
    },
  ) {
    return this.paywayService.handleCallback(body);
  }

  /**
   * Verify a PayWay payment — called by frontend after payment.
   */
  @Post('verify/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  verifyPayment(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @NestRequest() req: AuthRequest,
  ) {
    return this.paywayService.verifyPayment(orderId, req.user.sub);
  }

  /**
   * DEV ONLY — simulate a successful PayWay payment in sandbox mode.
   * Skips the real PayWay API and directly marks the order as PAID.
   * Only works when PAYWAY_BASE_URL contains "sandbox".
   */
  @Post('simulate/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  simulatePayment(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @NestRequest() req: AuthRequest,
  ) {
    return this.paywayService.simulatePayment(orderId, req.user.sub);
  }
}
