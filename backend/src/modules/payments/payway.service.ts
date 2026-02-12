import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import axios, { type AxiosResponse } from 'axios';
import FormData from 'form-data';
import { Order } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/orders.service';

/** Shape returned by PayWay Check Transaction API */
interface PaywayCheckResponse {
  data?: {
    payment_status?: string;
    payment_status_code?: number;
  };
}

/**
 * PayWay (ABA Bank) payment integration service.
 *
 * Flow:
 *  1. Frontend calls createTransaction() → backend builds hash, calls PayWay Purchase API
 *  2. PayWay returns HTML checkout page → frontend renders in popup/iframe
 *  3. User completes payment → PayWay POSTs to return_url (handleCallback)
 *  4. Backend verifies via Check Transaction API → marks order PAID
 */
@Injectable()
export class PaywayService {
  private readonly logger = new Logger(PaywayService.name);

  private readonly merchantId: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    private ordersService: OrdersService,
  ) {
    this.merchantId = process.env.PAYWAY_MERCHANT_ID || '';
    this.apiKey = process.env.PAYWAY_API_KEY || '';
    this.baseUrl =
      process.env.PAYWAY_BASE_URL || 'https://checkout-sandbox.payway.com.kh';

    if (!this.merchantId || !this.apiKey) {
      this.logger.warn(
        'PAYWAY_MERCHANT_ID or PAYWAY_API_KEY not set – PayWay features will fail.',
      );
    }
  }

  // ─── HASH HELPER ────────────────────────────────────────────
  private generateHash(data: string): string {
    return createHmac('sha512', this.apiKey).update(data).digest('base64');
  }

  private getReqTime(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      now.getUTCFullYear().toString() +
      pad(now.getUTCMonth() + 1) +
      pad(now.getUTCDate()) +
      pad(now.getUTCHours()) +
      pad(now.getUTCMinutes()) +
      pad(now.getUTCSeconds())
    );
  }

  // ─── CREATE TRANSACTION ─────────────────────────────────────
  /**
   * Initiate a PayWay purchase. Returns the HTML checkout page
   * that the frontend should render in a popup/iframe.
   */
  async createTransaction(
    orderId: string,
    userId: string,
    currency: 'USD' | 'KHR' = 'USD',
    paymentOption?: string,
  ) {
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

    // Prevent double-initiation — if already has a PayWay tran, check its status first
    if (order.paywayTranId) {
      const existing = await this.checkTransaction(order.paywayTranId);
      if (existing?.data?.payment_status === 'APPROVED') {
        throw new BadRequestException(
          'This order has already been paid via PayWay.',
        );
      }
    }

    // Generate a unique tran_id (max 20 chars)
    const tranId = Date.now().toString().slice(0, 17);

    const amount = Number(order.totalAmount);

    // Build items description (base64 JSON)
    const itemsJson = order.items.map((item) => ({
      name: item.product?.name || 'Product',
      quantity: item.quantity,
      price: Number(item.priceAtTime),
    }));
    const itemsB64 = Buffer.from(JSON.stringify(itemsJson)).toString('base64');

    // Build return_url (callback) — base64 encoded
    const returnUrl = process.env.PAYWAY_RETURN_URL || '';
    const returnUrlB64 = returnUrl
      ? Buffer.from(returnUrl).toString('base64')
      : '';

    // Continue success URL — where user goes after successful payment
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const continueSuccessUrl = `${frontendUrl}/orders/${orderId}/confirmation?payment=success&provider=payway`;

    // Cancel URL
    const cancelUrl = `${frontendUrl}/carts`;

    const reqTime = this.getReqTime();
    const shipping = Number(order.shippingAmount) || 0;

    // Build return_params to identify the order on callback
    const returnParams = orderId;

    // Fields to hash (concatenated in exact PayWay order)
    // req_time + merchant_id + tran_id + amount + items + shipping
    // + firstname + lastname + email + phone + type + payment_option
    // + return_url + cancel_url + continue_success_url + return_deeplink
    // + currency + custom_fields + return_params + payout + lifetime
    // + additional_params + google_pay_token + skip_success_page
    const firstname = '';
    const lastname = '';
    const email = '';
    const phone = '';
    const type = 'purchase';
    const paymentOpt = paymentOption || ''; // e.g. 'cards', 'abapay_khqr', or '' for all
    const returnDeeplink = '';
    const customFields = '';
    const payout = '';
    const lifetime = '';
    const additionalParams = '';
    const googlePayToken = '';
    const skipSuccessPage = '';

    const hashString =
      reqTime +
      this.merchantId +
      tranId +
      amount +
      itemsB64 +
      shipping +
      firstname +
      lastname +
      email +
      phone +
      type +
      paymentOpt +
      returnUrlB64 +
      cancelUrl +
      continueSuccessUrl +
      returnDeeplink +
      currency +
      customFields +
      returnParams +
      payout +
      lifetime +
      additionalParams +
      googlePayToken +
      skipSuccessPage;

    const hash = this.generateHash(hashString);

    // Build multipart/form-data body
    const form = new FormData();
    form.append('req_time', reqTime);
    form.append('merchant_id', this.merchantId);
    form.append('tran_id', tranId);
    form.append('amount', amount.toString());
    form.append('items', itemsB64);
    form.append('shipping', shipping.toString());
    form.append('currency', currency);
    form.append('type', type);
    if (paymentOpt) form.append('payment_option', paymentOpt);
    form.append('return_url', returnUrlB64);
    form.append('cancel_url', cancelUrl);
    form.append('continue_success_url', continueSuccessUrl);
    form.append('return_params', returnParams);
    form.append('view_type', 'popup'); // Force HTML checkout page instead of QR JSON
    form.append('hash', hash);

    // Call PayWay Purchase API
    const url = `${this.baseUrl}/api/payment-gateway/v1/payments/purchase`;

    try {
      const response: AxiosResponse<string> = await axios.post(url, form, {
        headers: { ...form.getHeaders() },
        maxRedirects: 0,
        validateStatus: (s: number) => s < 500,
        responseType: 'text', // force text — PayWay may return HTML or JSON
      });

      // Store the tran_id on the order
      order.paywayTranId = tranId;
      order.paymentProvider = 'payway';
      await this.ordersRepo.save(order);

      this.logger.log(
        `PayWay transaction created: tran_id=${tranId} orderId=${orderId}`,
      );

      // response.data is a string (HTML checkout page or JSON with QR data)
      let checkoutHtml = response.data;

      // If PayWay returned JSON (KHQR response), build an HTML page from the QR data
      if (
        typeof checkoutHtml === 'string' &&
        checkoutHtml.trim().startsWith('{')
      ) {
        try {
          const parsed = JSON.parse(checkoutHtml) as {
            status?: { code?: string; message?: string };
            qrString?: string;
            qrImage?: string;
            description?: string;
          };

          if (parsed.qrString || parsed.qrImage) {
            this.logger.log(
              `PayWay returned QR response for tran_id=${tranId}`,
            );
            checkoutHtml = this.buildQrCheckoutHtml(
              parsed.qrImage || '',
              amount,
              currency,
              tranId,
            );
          }
        } catch {
          // Not valid JSON — treat as raw HTML
        }
      }

      return {
        tranId,
        checkoutHtml,
      };
    } catch (err) {
      this.logger.error(
        `PayWay Purchase API failed: ${(err as Error).message}`,
      );
      throw new BadRequestException(
        'Failed to create PayWay transaction. Please try again.',
      );
    }
  }

  // ─── BUILD QR CHECKOUT HTML ────────────────────────────────
  /**
   * When PayWay returns JSON with QR data (KHQR),
   * build a styled HTML page to display the QR code.
   */
  private buildQrCheckoutHtml(
    qrImage: string,
    amount: number,
    currency: string,
    tranId: string,
  ): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PayWay - Scan to Pay</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex; align-items: flex-start; justify-content: center;
      background: #f8f9fa; color: #333;
    }
    .container {
      text-align: center; padding: 24px 16px; max-width: 400px; width: 100%;
    }
    .logo { font-size: 22px; font-weight: 700; color: #005ba6; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #666; margin-bottom: 16px; }
    .qr-wrapper {
      background: #fff; border-radius: 16px; padding: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08); display: inline-block;
    }
    .qr-wrapper img {
      width: 240px; height: 240px;
      image-rendering: crisp-edges; image-rendering: pixelated;
    }
    .amount {
      margin-top: 14px; font-size: 26px; font-weight: 700; color: #005ba6;
    }
    .amount .currency { font-size: 15px; font-weight: 400; color: #888; }
    .tran-id { font-size: 11px; color: #999; margin-top: 4px; }
    .instructions {
      margin-top: 14px; font-size: 12px; color: #666; line-height: 1.5;
    }
    .step { display: flex; align-items: center; gap: 8px; margin: 4px 0; justify-content: center; }
    .step-num {
      width: 20px; height: 20px; border-radius: 50%; background: #005ba6;
      color: #fff; font-size: 11px; font-weight: 600;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      margin-top: 12px; padding: 5px 12px;
      background: #e8f5e9; color: #2e7d32; border-radius: 20px; font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">ABA PayWay</div>
    <div class="subtitle">Scan QR code to pay</div>
    <div class="qr-wrapper">
      <img src="${qrImage}" alt="KHQR Code" />
    </div>
    <div class="amount">
      ${amount.toFixed(2)} <span class="currency">${currency}</span>
    </div>
    <div class="tran-id">Transaction: ${tranId}</div>
    <div class="instructions">
      <div class="step"><span class="step-num">1</span> Open ABA Mobile or any KHQR-supported app</div>
      <div class="step"><span class="step-num">2</span> Scan this QR code</div>
      <div class="step"><span class="step-num">3</span> Confirm payment in your app</div>
      <div class="step"><span class="step-num">4</span> Click "Verify" below once done</div>
    </div>
    <div class="badge">\u{1F512} Secured by ABA PayWay</div>
  </div>
</body>
</html>`;
  }

  // ─── HANDLE CALLBACK ───────────────────────────────────────
  /**
   * Called by PayWay when payment completes (POST to return_url).
   * Body: { tran_id, apv, status, return_params }
   *
   * status "0" = APPROVED
   */
  async handleCallback(body: {
    tran_id: string;
    apv?: string;
    status: string;
    return_params?: string;
  }) {
    const { tran_id, status, return_params } = body;

    this.logger.log(
      `[PayWay Callback] tran_id=${tran_id} status=${status} return_params=${return_params}`,
    );

    if (status !== '0') {
      this.logger.warn(
        `PayWay callback status is not APPROVED: status=${status} tran_id=${tran_id}`,
      );
      return { received: true, paid: false };
    }

    // return_params contains the orderId
    const orderId = return_params;
    if (!orderId) {
      this.logger.warn('PayWay callback missing orderId in return_params');
      return { received: true, paid: false };
    }

    // Double-verify with Check Transaction API
    const verification: PaywayCheckResponse | null =
      await this.checkTransaction(tran_id);
    if (verification?.data?.payment_status_code !== 0) {
      this.logger.warn(
        `PayWay Check Transaction says NOT approved for tran_id=${tran_id}`,
      );
      return { received: true, paid: false };
    }

    // Find the order
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      this.logger.warn(
        `Order not found for PayWay callback: orderId=${orderId}`,
      );
      return { received: true, paid: false };
    }

    if (order.status !== 'PENDING') {
      this.logger.log(
        `Order ${orderId} is already ${order.status}, skipping PayWay callback.`,
      );
      return { received: true, paid: false };
    }

    // Mark as PAID through OrdersService (handles stock deduction + validation)
    await this.ordersService.updateStatus(orderId, 'PAID');
    this.logger.log(`Order ${orderId} marked as PAID via PayWay`);

    return { received: true, paid: true };
  }

  // ─── VERIFY PAYMENT (frontend polling) ─────────────────────
  /**
   * Frontend can call this to check if the PayWay payment succeeded.
   * Checks both local order status and PayWay's Check Transaction API.
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

    // Already paid — just return order
    if (order.status !== 'PENDING') {
      return order;
    }

    // No PayWay tran_id — nothing to check
    if (!order.paywayTranId) {
      return order;
    }

    // Ask PayWay for real status
    const result: PaywayCheckResponse | null = await this.checkTransaction(
      order.paywayTranId,
    );
    if (result?.data?.payment_status_code === 0) {
      await this.ordersService.updateStatus(orderId, 'PAID');
      this.logger.log(`Order ${orderId} verified & marked as PAID via PayWay`);
      return this.ordersRepo.findOne({
        where: { id: orderId },
        relations: ['user', 'items', 'items.product'],
      });
    }

    return order;
  }

  // ─── SANDBOX SIMULATE ─────────────────────────────────────
  /**
   * DEV ONLY — simulate a successful payment without calling PayWay.
   * Only works when baseUrl contains "sandbox".
   */
  async simulatePayment(orderId: string, userId: string) {
    if (!this.baseUrl.includes('sandbox')) {
      throw new ForbiddenException(
        'Simulate is only available in sandbox mode',
      );
    }

    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.user.id !== userId) {
      throw new ForbiddenException('You cannot access this order');
    }

    if (order.status !== 'PENDING') {
      return order;
    }

    await this.ordersService.updateStatus(orderId, 'PAID');
    this.logger.warn(
      `[SANDBOX] Order ${orderId} simulated as PAID (no real payment)`,
    );

    return this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });
  }

  // ─── CHECK TRANSACTION API ─────────────────────────────────
  /**
   * Call PayWay Check Transaction API to verify a transaction's real status.
   */
  private async checkTransaction(
    tranId: string,
  ): Promise<PaywayCheckResponse | null> {
    const reqTime = this.getReqTime();
    const hashString = reqTime + this.merchantId + tranId;
    const hash = this.generateHash(hashString);

    const url = `${this.baseUrl}/api/payment-gateway/v1/payments/check-transaction-2`;

    try {
      const response: AxiosResponse<PaywayCheckResponse> = await axios.post(
        url,
        {
          req_time: reqTime,
          merchant_id: this.merchantId,
          tran_id: tranId,
          hash,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      this.logger.log(
        `[PayWay Check] tran_id=${tranId} status=${JSON.stringify(response.data?.data?.payment_status)}`,
      );

      return response.data;
    } catch (err) {
      this.logger.error(
        `PayWay Check Transaction failed: ${(err as Error).message}`,
      );
      return null;
    }
  }
}
