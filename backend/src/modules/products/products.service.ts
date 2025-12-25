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
      category,
    });

    return this.productsRepo.save(product);
  }

  findAll() {
    return this.productsRepo.find();
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
