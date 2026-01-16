import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async create(data: {
    name: string;
    inventorName: string;
    logoUrl: string;
    inventorImageUrl?: string | null;
  }) {
    // Prevent duplicate brand names
    const existing = await this.brandRepo.findOne({
      where: { name: data.name },
    });

    if (existing) {
      throw new BadRequestException('Brand name already exists');
    }

    const brand = this.brandRepo.create({
      name: data.name,
      inventorName: data.inventorName,
      logoUrl: data.logoUrl,
      ...(data.inventorImageUrl !== null && {
        inventorImageUrl: data.inventorImageUrl,
      }),
    });

    return this.brandRepo.save(brand);
  }

  async findAll() {
    return this.brandRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async update(
    id: string,
    data: {
      name?: string;
      inventorName?: string;
      logoUrl?: string;
      inventorImageUrl?: string;
    },
  ) {
    const brand = await this.findOne(id);

    // Check name uniqueness (if changed)
    if (data.name && data.name !== brand.name) {
      const exists = await this.brandRepo.findOne({
        where: { name: data.name },
      });

      if (exists) {
        throw new BadRequestException('Brand name already exists');
      }
    }

    Object.assign(brand, {
      ...(data.name && { name: data.name }),
      ...(data.inventorName && { inventorName: data.inventorName }),
      ...(data.logoUrl && { logoUrl: data.logoUrl }),
      ...(data.inventorImageUrl && {
        inventorImageUrl: data.inventorImageUrl,
      }),
    });

    return this.brandRepo.save(brand);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    // Prevent deleting brand that still has products
    if (brand.products?.length > 0) {
      throw new BadRequestException(
        'Cannot delete brand with existing products',
      );
    }

    await this.brandRepo.remove(brand);

    return { message: 'Brand deleted successfully' };
  }
}
