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
import PDFDocument from 'pdfkit';

@Injectable()
export class OrdersService {
  /**
   * Valid status transitions.
   * PENDING → PAID → PROCESSING → SHIPPED → DELIVERED → COMPLETED
   * Only PENDING can be cancelled. CANCELLED and COMPLETED are terminal.
   */
  private static readonly VALID_TRANSITIONS: Record<
    OrderStatus,
    OrderStatus[]
  > = {
    PENDING: ['PAID', 'CANCELLED'],
    PAID: ['PROCESSING'],
    PROCESSING: ['SHIPPED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: ['COMPLETED'],
    COMPLETED: [],
    CANCELLED: [],
  };

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

    // Second pass: create order items (stock is deducted later when PENDING → PAID)
    const items: OrderItem[] = [];
    let originalSubtotal = 0;
    let discountedSubtotal = 0;

    for (const it of dto.items) {
      const product = productMap.get(it.productId)!;

      // Apply discount to get final price
      const finalPrice =
        product.discountPercent > 0
          ? Number(product.price) * (1 - product.discountPercent / 100)
          : Number(product.price);

      const item = this.orderItemsRepo.create({
        product,
        quantity: it.quantity,
        priceAtTime: finalPrice,
      });

      originalSubtotal += Number(product.price) * it.quantity;
      discountedSubtotal += finalPrice * it.quantity;
      items.push(item);
    }

    originalSubtotal = Math.round(originalSubtotal * 100) / 100;
    discountedSubtotal = Math.round(discountedSubtotal * 100) / 100;

    // 1. VAT: 10% on original subtotal (before discount)
    const vatAmount = Math.round(originalSubtotal * 0.1 * 100) / 100;

    // 2. Discount on VAT-inclusive amount
    const discountAmount =
      Math.round((originalSubtotal - discountedSubtotal) * 1.1 * 100) / 100;

    // 3. Shipping: applied after VAT and discount
    const shippingAmount = discountedSubtotal >= 500 ? 0 : 5;

    // Total = original + VAT - discount + shipping
    const totalAmount =
      Math.round(
        (originalSubtotal + vatAmount - discountAmount + shippingAmount) * 100,
      ) / 100;

    const order = this.ordersRepo.create({
      user,
      items,
      shippingAmount,
      totalAmount,
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
      let newOriginalSubtotal = 0;
      let newDiscountedSubtotal = 0;

      for (const it of dto.items) {
        const product = await this.productsRepo.findOneBy({ id: it.productId });
        if (!product) throw new NotFoundException('Product not found');

        // Apply discount to get final price
        const finalPrice =
          product.discountPercent > 0
            ? Number(product.price) * (1 - product.discountPercent / 100)
            : Number(product.price);

        const item = this.orderItemsRepo.create({
          product,
          quantity: it.quantity,
          priceAtTime: finalPrice,
        });

        newOriginalSubtotal += Number(product.price) * it.quantity;
        newDiscountedSubtotal += finalPrice * it.quantity;
        newItems.push(item);
      }

      newOriginalSubtotal = Math.round(newOriginalSubtotal * 100) / 100;
      newDiscountedSubtotal = Math.round(newDiscountedSubtotal * 100) / 100;

      // 1. VAT: 10% on original subtotal (before discount)
      const newVat = Math.round(newOriginalSubtotal * 0.1 * 100) / 100;

      // 2. Discount on VAT-inclusive amount
      const newDiscount =
        Math.round((newOriginalSubtotal - newDiscountedSubtotal) * 1.1 * 100) /
        100;

      // 3. Shipping: applied after VAT and discount
      const newShipping = newDiscountedSubtotal >= 500 ? 0 : 5;

      order.items = newItems;
      order.shippingAmount = newShipping;
      // Total = original + VAT - discount + shipping
      order.totalAmount =
        Math.round(
          (newOriginalSubtotal + newVat - newDiscount + newShipping) * 100,
        ) / 100;
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

    // Restore stock only if it was already deducted (status is PAID or later, not PENDING/CANCELLED)
    const stockDeductedStatuses: OrderStatus[] = [
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'COMPLETED',
    ];
    if (stockDeductedStatuses.includes(order.status)) {
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

    // Delegate to updateStatus which validates transition and deducts stock
    return this.updateStatus(orderId, 'PAID');
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

    // Only PENDING orders can be cancelled
    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot cancel order with status: ${order.status}. Only PENDING orders can be cancelled.`,
      );
    }

    return this.updateStatus(orderId, 'CANCELLED');
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const previousStatus = order.status;

    // ── Transition validation ──
    const allowed = OrdersService.VALID_TRANSITIONS[previousStatus];
    if (!allowed || !allowed.includes(status)) {
      throw new BadRequestException(
        `Invalid status transition: ${previousStatus} → ${status}`,
      );
    }

    // ── Stock deduction: only on PENDING → PAID ──
    if (previousStatus === 'PENDING' && status === 'PAID') {
      await this.deductStock(order.items);
    }

    // ── Stock restoration: cancel from a stock-deducted state (safety net) ──
    if (status === 'CANCELLED' && previousStatus !== 'PENDING') {
      await this.restoreStock(order.items);
    }

    order.status = status;
    return this.ordersRepo.save(order);
  }

  /**
   * Helper: deduct stock for order items (called on PENDING → PAID)
   */
  private async deductStock(items: OrderItem[]) {
    for (const item of items) {
      const product = await this.productsRepo.findOneBy({
        id: item.product.id,
      });
      if (!product) {
        throw new BadRequestException(
          `Product no longer exists: ${item.product.id}`,
        );
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }
      product.stock -= item.quantity;
      await this.productsRepo.save(product);
    }
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

  /**
   * Generate a PDF receipt for a paid order.
   * Returns a PDFKit document (readable stream).
   */
  async generateReceipt(
    orderId: string,
    userId: string,
    role: 'USER' | 'ADMIN',
  ): Promise<PDFKit.PDFDocument> {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    if (role !== 'ADMIN' && order.user.id !== userId) {
      throw new ForbiddenException('You cannot access this receipt');
    }

    const paidStatuses: OrderStatus[] = [
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'COMPLETED',
    ];
    if (!paidStatuses.includes(order.status)) {
      throw new BadRequestException(
        'Receipt is only available for paid orders',
      );
    }

    // Derive subtotal and VAT from items (same logic as frontend)
    const subtotal = order.items.reduce(
      (sum, item) => sum + Number(item.priceAtTime) * item.quantity,
      0,
    );

    // Calculate original subtotal (before discount) from product prices
    const originalSubtotal = order.items.reduce(
      (sum, item) =>
        sum + Number(item.product?.price ?? item.priceAtTime) * item.quantity,
      0,
    );

    // VAT: 10% on original subtotal (before discount)
    const vat = Math.round(originalSubtotal * 0.1 * 100) / 100;

    // Discount on VAT-inclusive amount
    const baseDiscount = originalSubtotal - subtotal;
    const totalDiscount = Math.round(baseDiscount * 1.1 * 100) / 100;

    const shipping = Number(order.shippingAmount);
    const total = Number(order.totalAmount);

    // Build PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // ── Header ──
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('ELECTRO-STORE', { align: 'center' });
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#666666')
      .text('Receipt / Tax Invoice', { align: 'center' });
    doc.moveDown(1);

    // Divider
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.8);

    // ── Order info ──
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold');
    doc
      .text(`Order ID:`, 50, doc.y, { continued: true })
      .font('Helvetica')
      .text(`  ${order.id}`);
    doc
      .font('Helvetica-Bold')
      .text(`Date:`, 50, doc.y, { continued: true })
      .font('Helvetica')
      .text(
        `  ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      );
    doc
      .font('Helvetica-Bold')
      .text(`Status:`, 50, doc.y, { continued: true })
      .font('Helvetica')
      .text(`  ${order.status}`);
    doc.moveDown(0.5);

    // ── Customer info ──
    const user = order.user;
    const customerName =
      [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
    doc
      .font('Helvetica-Bold')
      .text(`Customer:`, 50, doc.y, { continued: true })
      .font('Helvetica')
      .text(`  ${customerName}`);
    doc
      .font('Helvetica-Bold')
      .text(`Email:`, 50, doc.y, { continued: true })
      .font('Helvetica')
      .text(`  ${user.email}`);
    if (user.addressStreet) {
      const address = [
        user.addressStreet,
        user.addressCity,
        user.addressState,
        user.addressPostCode,
        user.addressCountry,
      ]
        .filter(Boolean)
        .join(', ');
      doc
        .font('Helvetica-Bold')
        .text(`Address:`, 50, doc.y, { continued: true })
        .font('Helvetica')
        .text(`  ${address}`);
    }
    doc.moveDown(1);

    // Divider
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.8);

    // ── Items table header ──
    const tableTop = doc.y;
    const col1 = 50; // Product
    const col2 = 220; // Qty
    const col3 = 270; // Original Price
    const col4 = 350; // Discount
    const col5 = 430; // Total

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#374151');
    doc.text('Product', col1, tableTop);
    doc.text('Qty', col2, tableTop);
    doc.text('Unit Price', col3, tableTop);
    doc.text('Discount', col4, tableTop);
    doc.text('Total', col5, tableTop);
    doc.moveDown(0.5);

    doc
      .strokeColor('#e5e7eb')
      .lineWidth(0.5)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.5);

    // ── Items rows ──
    doc.font('Helvetica').fillColor('#000000').fontSize(9);
    for (const item of order.items) {
      const y = doc.y;
      const productName = item.product?.name || 'Unknown Product';
      const originalPrice = Number(item.product?.price ?? item.priceAtTime);
      const finalPrice = Number(item.priceAtTime);
      const discountPct = item.product?.discountPercent ?? 0;
      const lineTotal = finalPrice * item.quantity;

      doc.text(productName, col1, y, { width: 160 });
      doc.text(String(item.quantity), col2, y);

      if (discountPct > 0) {
        // Show original price with strikethrough effect
        doc.fillColor('#6b7280').text(`$${originalPrice.toFixed(2)}`, col3, y);
        doc.fillColor('#16a34a').text(`-${discountPct}%`, col4, y);
      } else {
        doc.fillColor('#000000').text(`$${originalPrice.toFixed(2)}`, col3, y);
        doc.fillColor('#6b7280').text('—', col4, y);
      }

      doc.fillColor('#000000').text(`$${lineTotal.toFixed(2)}`, col5, y);
      doc.moveDown(0.3);
    }

    doc.moveDown(0.5);
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.8);

    // ── Totals ──
    const totalsX = 350;
    const totalsValX = 440;

    doc.fontSize(10).font('Helvetica');

    doc
      .fillColor('#000000')
      .text('Subtotal:', totalsX, doc.y, { continued: false });
    doc.text(
      `$${originalSubtotal.toFixed(2)}`,
      totalsValX,
      doc.y - doc.currentLineHeight(),
    );

    doc.text('VAT (10%):', totalsX, doc.y, { continued: false });
    doc.text(`$${vat.toFixed(2)}`, totalsValX, doc.y - doc.currentLineHeight());

    // Show discount if applicable
    if (totalDiscount > 0) {
      doc
        .fillColor('#16a34a')
        .font('Helvetica-Bold')
        .text('Discount:', totalsX, doc.y, { continued: false });
      doc
        .fillColor('#16a34a')
        .text(
          `-$${totalDiscount.toFixed(2)}`,
          totalsValX,
          doc.y - doc.currentLineHeight(),
        );
      doc.font('Helvetica');
    }

    doc
      .fillColor('#000000')
      .text('Shipping:', totalsX, doc.y, { continued: false });
    doc.text(
      shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`,
      totalsValX,
      doc.y - doc.currentLineHeight(),
    );

    doc.moveDown(0.3);
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(0.5)
      .moveTo(totalsX, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Total:', totalsX, doc.y, { continued: false });
    doc.text(
      `$${total.toFixed(2)}`,
      totalsValX,
      doc.y - doc.currentLineHeight(),
    );

    doc.moveDown(2);

    // ── Footer ──
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#9ca3af')
      .text('Thank you for shopping with ELECTRO-STORE!', 50, doc.y, {
        align: 'center',
      })
      .text(`Generated on ${new Date().toLocaleString('en-US')}`, {
        align: 'center',
      });

    doc.end();
    return doc;
  }
}
