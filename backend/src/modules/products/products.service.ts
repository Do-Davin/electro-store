/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Brand } from '../brands/entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
    @InjectRepository(Brand)
    private brandsRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateProductDto, file: Express.Multer.File) {
    const category = await this.categoriesRepo.findOneBy({
      id: dto.categoryId,
    });
    if (!category) throw new NotFoundException('Category not found');

    const brand = await this.brandsRepo.findOneBy({
      id: dto.brandId,
    });
    if (!brand) throw new NotFoundException('Brand not found');

    let specs: Record<string, unknown> | undefined;

    if (dto.specs) {
      try {
        specs =
          typeof dto.specs === 'string'
          ? JSON.parse(dto.specs) as Record<string, unknown>
          : dto.specs;
      } catch {
        throw new BadRequestException('Invalid specs JSON format');
      }
    }

    const product = this.productsRepo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      discountPercent: dto.discountPercent ?? 0,
      specs: specs,
      imageUrl: `http://localhost:3000/uploads/products/${file.filename}`,
      category,
      brand,
    });

    return this.productsRepo.save(product);
  }

  async findAll({
    page,
    limit,
    search,
    category,
    minPrice,
    maxPrice,
  }: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
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

    if (minPrice !== undefined) {
      qb.andWhere(
        '("product"."price" * (1 - "product"."discountPercent"::decimal / 100)) >= :minPrice',
        { minPrice }
      );
    }

    if (maxPrice !== undefined) {
      qb.andWhere(
        '("product"."price" * (1 - "product"."discountPercent"::decimal / 100)) <= :maxPrice',
        { maxPrice }
      );
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

  // Internal entity fetch
  private async findEntity(id: string): Promise<Product> {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Product not found!');

    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File
  ) {
    const product = await this.findEntity(id);

    // Update category if provided
    if (dto.categoryId) {
      const category = await this.categoriesRepo.findOneBy({
        id: dto.categoryId,
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    if (dto.brandId) {
      const brand = await this.brandsRepo.findOneBy({
        id: dto.brandId,
      });
      if (!brand) throw new NotFoundException('Brand not found');
      product.brand = brand;
    }

    if (dto.specs !== undefined) {
    try {
      product.specs =
        typeof dto.specs === 'string'
          ? JSON.parse(dto.specs) as Record<string, unknown>
          : dto.specs;
    } catch {
      throw new BadRequestException('Invalid specs JSON format');
    }
  }

    // Update image only if new one uploaded
    if (file) {
      product.imageUrl = `http://localhost:3000/uploads/products/${file.filename}`;
    }

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.discountPercent !== undefined)
      product.discountPercent = dto.discountPercent;
    
    return this.productsRepo.save(product);
  }

  async remove(id: string) {
    await this.findEntity(id);
    await this.productsRepo.delete(id);
    return { message: 'Deleted successfully' };
  }

  // Deals
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
