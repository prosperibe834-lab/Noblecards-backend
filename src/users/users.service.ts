import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  toPublicUser(user: { id: string; email: string; firstName: string; lastName: string; phone: string | null; country: string | null; countryCode: string | null; gender: string | null; role: string; isEmailVerified: boolean }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      country: user.country,
      countryCode: user.countryCode,
      gender: user.gender,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };
  }
}