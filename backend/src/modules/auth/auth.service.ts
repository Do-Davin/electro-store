import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.users.create({ ...data, password: hashed });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid email');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid password');

    return this.signToken(user);
  }

  // JWT SIGNING
  async signToken(user: User): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role, // User | Admin
    };

    return {
      access_token: await this.jwt.signAsync(payload),
    };
  }
}
