import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// const storage = multer.diskStorage({
//   destination: './public/uploads/products',
//   filename: (req, file, cb) => {
//     const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, unique + '-' + file.originalname);
//   },
// });
const multerOptions: MulterOptions = {
  storage: multer.diskStorage({
    destination: './public/uploads/products',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
  limits: {
    fileSize: 1 * 1024 * 1024, // Limit file size to 1MB
  },
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ------------------- POST -------------------

  @UseInterceptors(FileInterceptor('image', multerOptions))
  @Post()
  createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateProductDto,
  ) {
    return this.productsService.create(body, file);
  }

  // ------------------- GET -------------------

  @Get()
  findAllProduct(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll({
      page,
      limit,
      search,
      category,
    });
  }

  @Get('deals')
  getDeals() {
    return this.productsService.fetchDeals();
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // ------------------- PATCH -------------------

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  updateProduct(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body, file);
  }

  // ------------------- DELETE -------------------

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
