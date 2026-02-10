import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { sub: string; email: string; role: string };
}

const avatarMulterOptions = {
  storage: multer.diskStorage({
    destination: './public/uploads/avatars',
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + '-' + file.originalname);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  // ── Profile (authenticated user only) ──

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthRequest): Promise<any> {
    return this.usersService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Request() req: AuthRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<any> {
    return this.usersService.updateProfile(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/avatar')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterOptions))
  uploadAvatar(
    @Request() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const avatarUrl = `http://localhost:3000/uploads/avatars/${file.filename}`;
    return this.usersService.updateAvatar(req.user.sub, avatarUrl);
  }

  // Testing
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: AuthRequest) {
    return req.user;
  }

  @Get(':id')
  findOneUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
}
