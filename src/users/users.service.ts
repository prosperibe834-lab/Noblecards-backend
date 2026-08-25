import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found.');
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({ where: { username: dto.username, NOT: { id: userId } } });
      if (existing) throw new ConflictException('That username is already in use.');
    }
    if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = await this.findByEmail(dto.email);
      if (existing && existing.id !== userId) throw new ConflictException('That email address is already in use.');
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: dto.email?.trim().toLowerCase(),
        firstName: dto.firstName?.trim(),
        lastName: dto.lastName?.trim(),
        username: dto.username?.trim().toLowerCase(),
        displayName: dto.displayName?.trim() || null,
        phone: dto.phone?.trim() || null,
        country: dto.country?.trim() || null,
        countryCode: dto.countryCode?.trim() || null,
        gender: dto.gender?.trim() || null,
        dateOfBirth: dto.dateOfBirth ? this.parseDate(dto.dateOfBirth) : null,
        bio: dto.bio?.trim() || null,
        address: dto.address?.trim() || null,
        ...(dto.profileImageUrl !== undefined ? { profileImageUrl: dto.profileImageUrl.trim() || null } : {}),
      },
    });
    return this.recalculateVerification(updated);
  }

  async setProfileImage(userId: string, profileImageUrl: string | null) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found.');
    return this.recalculateVerification(await this.prisma.user.update({ where: { id: userId }, data: { profileImageUrl } }));
  }

  refreshVerification(user: Awaited<ReturnType<UsersService['findById']>>) {
    if (!user) throw new NotFoundException('User not found.');
    return this.recalculateVerification(user);
  }

  private parseDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new BadRequestException('Invalid date of birth.');
    return date;
  }

  private recalculateVerification(user: Parameters<UsersService['toPublicUser']>[0] & { username?: string | null; displayName?: string | null; dateOfBirth?: Date | null; bio?: string | null; address?: string | null; profileImageUrl?: string | null }) {
    const complete = [user.firstName, user.lastName, user.username, user.country, user.gender, user.bio].every((value) => Boolean(value?.trim()));
    return this.prisma.user.update({ where: { id: user.id }, data: { isProfileComplete: complete, isVerified: user.isEmailVerified && complete }, });
  }

  toPublicUser(user: { id: string; email: string; firstName: string; lastName: string; username?: string | null; displayName?: string | null; phone: string | null; country: string | null; countryCode: string | null; gender: string | null; dateOfBirth?: Date | null; bio?: string | null; address?: string | null; profileImageUrl?: string | null; role: string; isEmailVerified: boolean; isProfileComplete?: boolean; isVerified?: boolean }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username ?? null,
      displayName: user.displayName ?? null,
      phone: user.phone,
      country: user.country,
      countryCode: user.countryCode,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      bio: user.bio ?? null,
      address: user.address ?? null,
      profileImageUrl: user.profileImageUrl ?? null,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isProfileComplete: user.isProfileComplete ?? false,
      isVerified: user.isVerified ?? false,
    };
  }
}