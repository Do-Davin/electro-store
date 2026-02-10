import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.usersRepo.create(dto);
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find();
  }

  findOne(id: string) {
    return this.usersRepo.findOneBy({ id });
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  // ── Profile ──

  async getProfile(userId: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    avatar: string;
    memberSince: Date;
    address: {
      street: string;
      city: string;
      state: string;
      postCode: string;
      country: string;
    };
  }> {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // Return profile shape matching the frontend
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      gender: user.gender || 'male',
      dateOfBirth: user.dateOfBirth || '',
      avatar: user.avatar || '',
      memberSince: user.createdAt,
      address: {
        street: user.addressStreet || '',
        city: user.addressCity || '',
        state: user.addressState || '',
        postCode: user.addressPostCode || '',
        country: user.addressCountry || '',
      },
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<ReturnType<typeof this.getProfile>> {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // Only update fields that were provided
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.gender !== undefined) user.gender = dto.gender;
    if (dto.dateOfBirth !== undefined) user.dateOfBirth = dto.dateOfBirth;
    if (dto.addressStreet !== undefined) user.addressStreet = dto.addressStreet;
    if (dto.addressCity !== undefined) user.addressCity = dto.addressCity;
    if (dto.addressState !== undefined) user.addressState = dto.addressState;
    if (dto.addressPostCode !== undefined)
      user.addressPostCode = dto.addressPostCode;
    if (dto.addressCountry !== undefined)
      user.addressCountry = dto.addressCountry;

    await this.usersRepo.save(user);
    return this.getProfile(userId);
  }

  async updateAvatar(
    userId: string,
    avatarUrl: string,
  ): Promise<ReturnType<typeof this.getProfile>> {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    user.avatar = avatarUrl;
    await this.usersRepo.save(user);
    return this.getProfile(userId);
  }
}
