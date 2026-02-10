import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    // Prevent duplicate category names
    const existing = await this.categoryRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException('Category name already exists');
    }

    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    // Check name uniqueness (if changed)
    if (dto.name && dto.name !== category.name) {
      const exists = await this.categoryRepo.findOne({
        where: { name: dto.name },
      });
      if (exists) {
        throw new BadRequestException('Category name already exists');
      }
    }

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Prevent deleting category that still has products
    if (category.products?.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing products',
      );
    }

    await this.categoryRepo.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
