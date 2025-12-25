import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAllProduct() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
