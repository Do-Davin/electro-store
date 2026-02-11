import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async generateDailyReport(dateStr: string): Promise<PDFKit.PDFDocument> {
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    const startDate = new Date(`${dateStr}T00:00:00.000`);
    const endDate = new Date(`${dateStr}T23:59:59.999`);

    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid date provided.');
    }

    // Fetch orders for the date
    const orders = await this.ordersRepo.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'ASC' },
    });

    // Calculate totals from paid orders only (exclude PENDING and CANCELLED)
    const paidStatuses = [
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'COMPLETED',
    ];
    const paidOrders = orders.filter((o) => paidStatuses.includes(o.status));

    const totalOrders = orders.length;
    const totalPaidOrders = paidOrders.length;

    const totalRevenue = paidOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0,
    );

    const totalShipping = paidOrders.reduce(
      (sum, o) => sum + Number(o.shippingAmount),
      0,
    );

    // Derive VAT from items (10% of subtotal)
    const totalVat = paidOrders.reduce((sum, o) => {
      const subtotal = o.items.reduce(
        (s, item) => s + Number(item.priceAtTime) * item.quantity,
        0,
      );
      return sum + Math.round(subtotal * 10) / 100;
    }, 0);

    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Build PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // ── Header ──
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('ElectroStore', { align: 'center' });
    doc.moveDown(0.3);
    doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#374151')
      .text('Daily Sales Report', { align: 'center' });
    doc.moveDown(0.2);
    doc
      .fontSize(11)
      .fillColor('#6b7280')
      .text(formattedDate, { align: 'center' });
    doc.moveDown(1);

    // Divider
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(1);

    // ── Summary Cards ──
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('Summary');
    doc.moveDown(0.6);

    const summaryData = [
      ['Total Orders', String(totalOrders)],
      ['Paid Orders', String(totalPaidOrders)],
      ['Total Revenue', `$${totalRevenue.toFixed(2)}`],
      ['Total VAT Collected', `$${totalVat.toFixed(2)}`],
      ['Total Shipping Collected', `$${totalShipping.toFixed(2)}`],
    ];

    doc.fontSize(10).font('Helvetica');
    for (const [label, value] of summaryData) {
      const y = doc.y;
      doc.fillColor('#6b7280').text(label, 60, y);
      doc.fillColor('#000000').font('Helvetica-Bold').text(value, 300, y);
      doc.font('Helvetica');
      doc.moveDown(0.4);
    }

    doc.moveDown(0.8);

    // Divider
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(1);

    // ── Orders Table ──
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Orders');
    doc.moveDown(0.6);

    if (orders.length === 0) {
      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#9ca3af')
        .text('No orders found for this date.', { align: 'center' });
    } else {
      // Table header
      const col1 = 50; // Order ID
      const col2 = 140; // Customer
      const col3 = 310; // Status
      const col4 = 390; // Total
      const col5 = 470; // Time

      doc.fontSize(8).font('Helvetica-Bold').fillColor('#6b7280');
      doc.text('ORDER ID', col1, doc.y);
      doc.text('CUSTOMER', col2, doc.y - doc.currentLineHeight());
      doc.text('STATUS', col3, doc.y - doc.currentLineHeight());
      doc.text('TOTAL', col4, doc.y - doc.currentLineHeight());
      doc.text('TIME', col5, doc.y - doc.currentLineHeight());
      doc.moveDown(0.4);

      doc
        .strokeColor('#e5e7eb')
        .lineWidth(0.5)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();
      doc.moveDown(0.4);

      // Table rows
      doc.fontSize(9).font('Helvetica').fillColor('#000000');
      for (const order of orders) {
        // Check if we need a new page
        if (doc.y > 720) {
          doc.addPage();
          doc.y = 50;
        }

        const y = doc.y;
        const customerName =
          [order.user?.firstName, order.user?.lastName]
            .filter(Boolean)
            .join(' ') ||
          order.user?.email ||
          'Guest';
        const time = new Date(order.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        doc
          .fillColor('#3b82f6')
          .text(`#${order.id.slice(0, 8).toUpperCase()}`, col1, y, {
            width: 80,
          });
        doc.fillColor('#000000').text(customerName, col2, y, { width: 160 });
        doc
          .fillColor(
            paidStatuses.includes(order.status) ? '#16a34a' : '#6b7280',
          )
          .text(order.status, col3, y, { width: 70 });
        doc
          .fillColor('#000000')
          .text(`$${Number(order.totalAmount).toFixed(2)}`, col4, y, {
            width: 70,
          });
        doc.fillColor('#6b7280').text(time, col5, y, { width: 70 });
        doc.moveDown(0.3);
      }
    }

    doc.moveDown(2);

    // ── Footer ──
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#9ca3af')
      .text(`Generated on ${new Date().toLocaleString('en-US')}`, 50, doc.y, {
        align: 'center',
      })
      .text('ElectroStore — Confidential', { align: 'center' });

    doc.end();
    return doc;
  }

  /**
   * Get dashboard statistics.
   * Revenue calculation includes ONLY: PAID, PROCESSING, SHIPPED, DELIVERED, COMPLETED
   * Excludes: PENDING, CANCELLED, FAILED
   */
  async getDashboardStats() {
    // Define paid statuses (source of truth for revenue calculation)
    const paidStatuses = [
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'COMPLETED',
    ];

    // Get total products count
    const totalProducts = await this.productsRepo.count();

    // Get total users count
    const totalUsers = await this.usersRepo.count();

    // Get total orders count (all orders)
    const totalOrders = await this.ordersRepo.count();

    // Get recent orders (latest 10)
    const recentOrders = await this.ordersRepo.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    // Calculate revenue from PAID orders only
    const paidOrders = await this.ordersRepo.find({
      where: {
        status: In(paidStatuses),
      },
    });

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
    };
  }
}
