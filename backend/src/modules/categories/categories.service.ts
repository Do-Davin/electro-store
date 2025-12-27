import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create(dto);
    console.log(`[CATEGORY] created.`);
    return this.categoryRepo.save(category);
  }

  findAll() {
    console.log(`[CATEGORY] fetched all.`);
    return this.categoryRepo.find();
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    console.log(`[CATEGORY] fetched: ${id}`);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    await this.categoryRepo.update(id, dto);
    console.log(`[CATEGORY] Updated: ${id}`);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.categoryRepo.delete(id);
    console.log(`[CATEGORY] Removed: ${id}`);
    return { message: 'Deleted successfully' };
  }
}
