import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

  async getAdminUsers(query: Record<string, string | undefined>) {
    const page = Math.max(Number(query.page ?? 1) || 1, 1);
    const pageSize = Math.min(Math.max(Number(query.pageSize ?? 10) || 10, 1), 100);
    const search = query.search?.trim();
    const status = query.status && query.status !== 'All' ? query.status : undefined;
    const kycStatus = query.kycStatus && query.kycStatus !== 'All' ? query.kycStatus : undefined;
    const country = query.country && query.country !== 'All Countries' ? query.country : undefined;
    const joinedDate = query.joinedDate && query.joinedDate !== 'All Time' ? query.joinedDate : undefined;
    const now = new Date();
    const dateStart = joinedDate === 'Today'
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
      : joinedDate === 'This Week'
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
        : joinedDate === 'This Month'
          ? new Date(now.getFullYear(), now.getMonth(), 1)
          : undefined;
    const where = {
      ...(search ? { OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { username: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } },
        { id: { contains: search, mode: 'insensitive' as const } },
        { country: { contains: search, mode: 'insensitive' as const } },
      ] } : {}),
      ...(country ? { country: { equals: country, mode: 'insensitive' as const } } : {}),
      ...(dateStart ? { createdAt: { gte: dateStart } } : {}),
      ...(status === 'Active' ? { isActive: true } : {}),
      ...(status === 'Suspended' || status === 'Banned' ? { isActive: false } : {}),
      ...(status === 'Pending' ? { isEmailVerified: false } : {}),
      ...(kycStatus === 'Verified' ? { isVerified: true } : {}),
      ...(kycStatus === 'Pending' ? { isEmailVerified: true, isVerified: false } : {}),
      ...(kycStatus === 'Not Submitted' ? { isEmailVerified: false } : {}),
      ...(kycStatus === 'Rejected' ? { isActive: false, isVerified: false } : {}),
    };
    const sortFields: Record<string, string> = {
      fullName: 'firstName',
      balance: 'createdAt',
      cards: 'createdAt',
      joinedDate: 'createdAt',
    };
    const orderBy = { [sortFields[query.sortBy ?? 'joinedDate'] ?? 'createdAt']: query.direction === 'asc' ? 'asc' as const : 'desc' as const };
    const derivedSort = query.sortBy === 'balance' || query.sortBy === 'cards';
    const [users, total, stats, countryRows, cardCounts, walletBalances] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, email: true, firstName: true, lastName: true, username: true,
          phone: true, country: true, gender: true, dateOfBirth: true, address: true,
          profileImageUrl: true, isEmailVerified: true, isVerified: true, isActive: true,
          createdAt: true, updatedAt: true,
        },
        orderBy,
        ...(derivedSort ? {} : { skip: (page - 1) * pageSize, take: pageSize }),
      }),
      this.prisma.user.count({ where }),
      this.getAdminUserStats(),
      this.prisma.user.findMany({ where: { country: { not: null } }, distinct: ['country'], select: { country: true }, orderBy: { country: 'asc' } }),
      this.prisma.$queryRaw<Array<{ userId: string; count: bigint }>>`
        SELECT "userId", COUNT(*)::bigint AS "count"
        FROM "GiftCardSale"
        GROUP BY "userId"
      `,
      this.prisma.$queryRaw<Array<{ userId: string; balance: string }>>`
        SELECT w."userId", COALESCE(SUM(wb."availableBalance"), 0)::text AS "balance"
        FROM "Wallet" w
        JOIN "WalletBalance" wb ON wb."walletId" = w."id"
        WHERE wb."currencyCode" = 'USD'
        GROUP BY w."userId"
      `,
    ]);
    const cardCountByUser = new Map(cardCounts.map((row) => [row.userId, Number(row.count)]));
    const balanceByUser = new Map(walletBalances.map((row) => [row.userId, Number(row.balance)]));
    let mappedUsers = users.map((user) => this.toAdminUser(user, cardCountByUser.get(user.id) ?? 0, balanceByUser.get(user.id) ?? 0));
    if (derivedSort) {
      const key = query.sortBy === 'cards' ? 'cards' : 'balance';
      mappedUsers = mappedUsers.sort((left, right) => {
        const difference = Number(left[key]) - Number(right[key]);
        return query.direction === 'asc' ? difference : -difference;
      });
    }
    return {
      users: mappedUsers.slice((page - 1) * pageSize, page * pageSize),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      stats,
      countries: countryRows.map((row) => row.country).filter((value): value is string => Boolean(value)),
    };
  }

  async updateAdminUserStatus(id: string, status: string) {
    const normalized = status.trim().toUpperCase();
    if (!['ACTIVE', 'SUSPENDED', 'BANNED'].includes(normalized)) {
      throw new BadRequestException('Unsupported user status.');
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: normalized === 'ACTIVE' },
      select: { id: true, isActive: true },
    });
    return { id: user.id, status: user.isActive ? 'Active' : normalized === 'BANNED' ? 'Banned' : 'Suspended' };
  }

  async createAdminUser(body: Record<string, unknown>) {
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    if (!email || !password) throw new BadRequestException('Email and password are required.');
    const fullName = String(body.fullName ?? '').trim().split(/\s+/);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 12),
        firstName: fullName.shift() ?? '',
        lastName: fullName.join(' '),
        username: this.optionalString(body.username)?.replace(/^@/, '') || null,
        phone: this.optionalString(body.phone),
        country: this.optionalString(body.country),
        gender: this.optionalString(body.gender),
        isEmailVerified: body.kycStatus === 'Verified',
        isActive: body.status !== 'Suspended' && body.status !== 'Banned',
      },
      select: { id: true },
    });
    return { id: user.id, created: true };
  }

  async updateAdminUser(id: string, body: Record<string, unknown>) {
    const fullName = String(body.fullName ?? '').trim().split(/\s+/);
    const data: Record<string, unknown> = {
      firstName: fullName.shift() ?? '',
      lastName: fullName.join(' '),
      username: this.optionalString(body.username)?.replace(/^@/, '') || null,
      phone: this.optionalString(body.phone),
      country: this.optionalString(body.country),
      gender: this.optionalString(body.gender),
      isEmailVerified: body.kycStatus === 'Verified',
      isActive: body.status !== 'Suspended' && body.status !== 'Banned',
    };
    if (body.password) data.passwordHash = await bcrypt.hash(String(body.password), 12);
    const user = await this.prisma.user.update({ where: { id }, data, select: { id: true } });
    return { id: user.id, updated: true };
  }

  async deactivateAdminUser(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true },
    });
    return { id: user.id, status: 'Suspended', deactivated: true };
  }

  private optionalString(value: unknown) {
    const text = String(value ?? '').trim();
    return text || null;
  }

  private async getAdminUserStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [totalUsers, activeUsers, newUsersToday, pendingVerification, suspendedUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.user.count({ where: { isVerified: false } }),
      this.prisma.user.count({ where: { isActive: false } }),
    ]);
    const stat = (count: number) => ({ count, change: '', isPositive: true, period: 'current' });
    return { totalUsers: stat(totalUsers), activeUsers: stat(activeUsers), newUsersToday: stat(newUsersToday), pendingVerification: stat(pendingVerification), suspendedUsers: stat(suspendedUsers) };
  }

  private toAdminUser(user: any, cardCount: number, balance: number) {
    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
    return {
      id: user.id,
      userId: user.id,
      fullName,
      username: user.username ? `@${user.username.replace(/^@/, '')}` : '@N/A',
      email: user.email,
      phone: user.phone ?? 'N/A',
      country: user.country ?? 'N/A',
      gender: user.gender ?? 'N/A',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : 'N/A',
      address: user.address ?? 'N/A',
      kycStatus: user.isVerified ? 'Verified' : user.isEmailVerified ? 'Pending' : 'Not Submitted',
      balance,
      cards: cardCount,
      status: !user.isEmailVerified ? 'Pending' : user.isActive ? 'Active' : 'Suspended',
      joinedDate: user.createdAt.toISOString().slice(0, 10),
      avatar: user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
    };
  }

  async hasTransactionPin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { transactionPinHash: true },
    });
    if (!user) throw new NotFoundException('User not found.');
    return user.transactionPinHash != null;
  }

  async createTransactionPin(userId: string, pin: string) {
    if (!/^\d{4}$/.test(pin)) {
      throw new BadRequestException('Transaction PIN must be exactly 4 digits.');
    }

    const transactionPinHash = await bcrypt.hash(pin, 12);
    const result = await this.prisma.user.updateMany({
      where: { id: userId, transactionPinHash: null },
      data: { transactionPinHash, transactionPinFailedAttempts: 0, transactionPinLockedUntil: null },
    });

    if (result.count === 0) {
      const user = await this.findById(userId);
      if (!user) throw new NotFoundException('User not found.');
      throw new ConflictException('A transaction PIN already exists.');
    }
  }

  async verifyTransactionPin(userId: string, pin: string) {
    if (!/^\d{4}$/.test(pin)) {
      throw new BadRequestException('Transaction PIN must be exactly 4 digits.');
    }

    return this.prisma.$transaction(async (transaction) => {
      const rows = await transaction.$queryRaw<Array<{
        transactionPinHash: string | null;
        transactionPinFailedAttempts: number;
        transactionPinLockedUntil: Date | null;
      }>>`
        SELECT "transactionPinHash", "transactionPinFailedAttempts", "transactionPinLockedUntil"
        FROM "User"
        WHERE "id" = ${userId}
        FOR UPDATE
      `;
      const user = rows[0];
      if (!user) throw new NotFoundException('User not found.');
      if (!user.transactionPinHash) throw new BadRequestException('Transaction PIN is not configured.');
      if (user.transactionPinLockedUntil && user.transactionPinLockedUntil > new Date()) {
        throw new HttpException('Transaction PIN is temporarily locked.', HttpStatus.TOO_MANY_REQUESTS);
      }

      const valid = await bcrypt.compare(pin, user.transactionPinHash);
      if (valid) {
        await transaction.user.update({
          where: { id: userId },
          data: { transactionPinFailedAttempts: 0, transactionPinLockedUntil: null },
        });
        return true;
      }

      const failedAttempts = user.transactionPinFailedAttempts + 1;
      await transaction.user.update({
        where: { id: userId },
        data: {
          transactionPinFailedAttempts: failedAttempts,
          transactionPinLockedUntil: failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      });
      throw new BadRequestException('Invalid transaction PIN.');
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found.');
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({ where: { username: dto.username, NOT: { id: userId } } });
      if (existing) throw new ConflictException('That username is already in use.');
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
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

  toPublicUser(user: { id: string; email: string; firstName: string; lastName: string; username?: string | null; displayName?: string | null; phone: string | null; country: string | null; countryCode: string | null; gender: string | null; dateOfBirth?: Date | null; bio?: string | null; address?: string | null; profileImageUrl?: string | null; role: string; isEmailVerified: boolean; isProfileComplete?: boolean; isVerified?: boolean; transactionPinHash?: string | null }) {
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
      hasTransactionPin: user.transactionPinHash != null,
    };
  }
}