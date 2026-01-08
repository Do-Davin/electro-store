import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto, file: Express.Multer.File) {
    const category = await this.categoriesRepo.findOneBy({
      id: dto.categoryId,
    });
    if (!category) throw new NotFoundException('Category not found');

    const product = this.productsRepo.create({
      ...dto,
      imageUrl: `http://localhost:3000/uploads/products/${file.filename}`,
      category,
    });

    return this.productsRepo.save(product);
  }

  async findAll({
    page = 1,
    limit = 12,
    search,
    category,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) {
    const qb = this.productsRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      qb.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (category) {
      qb.andWhere('category.id = :categoryId', { categoryId: category });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    console.log('[PRODUCT]: Get all product');
    console.log('[PRODUCT] USING PAGINATED FIND ALL');

    return {
      data: data.map((product) => this.withFinalPrice(product)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.withFinalPrice(product);
  }

  async update(id: string, dto: UpdateProductDto, file?: Express.Multer.File) {
    const product = await this.findOne(id);

    // Update category if provided
    if (dto.categoryId) {
      const category = await this.categoriesRepo.findOneBy({
        id: dto.categoryId,
      });

      if (!category) throw new NotFoundException('Category not found');

      product.category = category;
    }

    // Update image only if new one uploaded
    if (file) {
      product.imageUrl = `http://localhost:3000/uploads/products/${file.filename}`;
    }

    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productsRepo.delete(id);
    return { message: 'Deleted successfully' };
  }

  async fetchDeals() {
    const products = await this.productsRepo.find({
      relations: ['category'],
      where: { discountPercent: MoreThan(0) },
    });

    return products.map((product) => this.withFinalPrice(product));
  }

  private withFinalPrice(product: Product) {
    return {
      ...product,
      finalPrice:
        product.discountPercent > 0
          ? Number(product.price) * (1 - product.discountPercent / 100)
          : Number(product.price),
    };
  }
}
