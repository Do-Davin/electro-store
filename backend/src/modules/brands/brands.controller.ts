import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import multer from 'multer';

const multerOptions: MulterOptions = {
  storage: multer.diskStorage({
    destination: './public/uploads/brands',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
};

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  // ------------------- POST -------------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'inventorImage', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  createBrand(
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      inventorImage?: Express.Multer.File[];
    },
    @Body() body: CreateBrandDto,
  ) {
    if (!files?.logo?.[0]) {
      throw new BadRequestException('Brand logo is required');
    }

    return this.brandsService.create({
      name: body.name,
      inventorName: body.inventorName,
      logoUrl: `/uploads/brands/${files.logo[0].filename}`,
      inventorImageUrl: files.inventorImage?.[0]
        ? `/uploads/brands/${files.inventorImage[0].filename}`
        : null,
    });
  }

  // ------------------- GET -------------------

  @Get()
  findAllBrands() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOneBrand(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  // ------------------- PATCH -------------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'inventorImage', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  updateBrand(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      inventorImage?: Express.Multer.File[];
    },
    @Body() body: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, {
      name: body.name,
      inventorName: body.inventorName,
      ...(files?.logo?.[0] && {
        logoUrl: `/uploads/brands/${files.logo[0].filename}`,
      }),
      ...(files?.inventorImage?.[0] && {
        inventorImageUrl: `/uploads/brands/${files.inventorImage[0].filename}`,
      }),
    });
  }

  // ------------------- DELETE -------------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  removeBrand(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
