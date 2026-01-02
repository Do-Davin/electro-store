import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(dto: CreateProductDto) {
    const category = await this.categoriesRepo.findOneBy({
      id: dto.categoryId,
    });
    if (!category) throw new NotFoundException('Category not found');

    const product = this.productsRepo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      imageUrl: dto.imageUrl,
      category,
    });

    console.log(`[PRODUCT] created successfully!`);
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
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.categoriesRepo.findOneBy({
        id: dto.categoryId,
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productsRepo.delete(id);
    return { message: 'Deleted successfully' };
  }
}
