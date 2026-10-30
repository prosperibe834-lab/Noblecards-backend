import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBiometricSettingsDto, UpdateProfileDto } from './users.dto';
import {
  SecurityAuditEventInput,
  writeSecurityAuditEvent,
} from '../security-audit/security-audit.utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly email?: EmailService,
  ) {}

  findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getAdminUsers(query: Record<string, string | undefined>) {
    const page = Math.max(Number(query.page ?? 1) || 1, 1);
    const pageSize = Math.min(
      Math.max(Number(query.pageSize ?? 10) || 10, 1),
      100,
    );
    const search = query.search?.trim();
    const cleanSearch = search ? search.replace(/^@/, '') : '';
    const status =
      query.status && query.status !== 'All' ? query.status : undefined;
    const kycStatus =
      query.kycStatus && query.kycStatus !== 'All'
        ? query.kycStatus
        : undefined;
    const country =
      query.country && query.country !== 'All Countries'
        ? query.country
        : undefined;
    const joinedDate =
      query.joinedDate && query.joinedDate !== 'All Time'
        ? query.joinedDate
        : undefined;
    const now = new Date();
    const dateStart =
      joinedDate === 'Today'
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
        : joinedDate === 'This Week'
          ? new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - now.getDay(),
            )
          : joinedDate === 'This Month'
            ? new Date(now.getFullYear(), now.getMonth(), 1)
            : undefined;
    const where = {
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
              { username: { contains: cleanSearch || search, mode: 'insensitive' as const } },
              { email: { contains: cleanSearch || search, mode: 'insensitive' as const } },
              { phone: { contains: search, mode: 'insensitive' as const } },
              { id: { contains: search, mode: 'insensitive' as const } },
              { country: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(country
        ? { country: { equals: country, mode: 'insensitive' as const } }
        : {}),
      ...(dateStart ? { createdAt: { gte: dateStart } } : {}),
      ...(status === 'Active' ? { isActive: true, isEmailVerified: true } : {}),
      ...(status === 'Suspended' || status === 'Banned'
        ? { isActive: false }
        : {}),
      ...(status === 'Pending' ? { isEmailVerified: false } : {}),
      ...(kycStatus === 'Verified' ? { isVerified: true } : {}),
      ...(kycStatus === 'Pending'
        ? { isEmailVerified: true, isVerified: false }
        : {}),
      ...(kycStatus === 'Not Submitted' || kycStatus === 'Not Verified'
        ? { isEmailVerified: false }
        : {}),
      ...(kycStatus === 'Rejected'
        ? { isActive: false, isVerified: false }
        : {}),
    };
    const sortFields: Record<string, string> = {
      fullName: 'firstName',
      balance: 'createdAt',
      cards: 'createdAt',
      joinedDate: 'createdAt',
    };
    const orderBy = {
      [sortFields[query.sortBy ?? 'joinedDate'] ?? 'createdAt']:
        query.direction === 'asc' ? ('asc' as const) : ('desc' as const),
    };
    const derivedSort = query.sortBy === 'balance' || query.sortBy === 'cards';
    const [
      users,
      total,
      stats,
      countryRows,
      cardCounts,
      walletBalances,
      txStats,
      cardPurchases,
      cardSales,
      referralCounts,
    ] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          phone: true,
          country: true,
          gender: true,
          dateOfBirth: true,
          address: true,
          profileImageUrl: true,
          isEmailVerified: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy,
        ...(derivedSort
          ? {}
          : { skip: (page - 1) * pageSize, take: pageSize }),
      }),
      this.prisma.user.count({ where }),
      this.getAdminUserStats(),
      this.prisma.user.findMany({
        where: { country: { not: null } },
        distinct: ['country'],
        select: { country: true },
        orderBy: { country: 'asc' },
      }),
      this.prisma.$queryRaw<Array<{ userId: string; count: bigint }>>`
        SELECT "userId", COUNT(*)::bigint AS "count"
        FROM (
          SELECT "userId" FROM "GiftCardSale"
          UNION ALL
          SELECT "userId" FROM "GiftCardPurchase"
        ) cards
        GROUP BY "userId"
      `,
      this.prisma.$queryRaw<Array<{ userId: string; balance: string }>>`
        SELECT w."userId", COALESCE(SUM(wb."availableBalance"), 0)::text AS "balance"
        FROM "Wallet" w
        JOIN "WalletBalance" wb ON wb."walletId" = w."id"
        WHERE wb."currencyCode" = 'USD'
        GROUP BY w."userId"
      `,
      this.prisma.$queryRaw<Array<{ userId: string; txCount: bigint; volume: string }>>`
        SELECT "userId", COUNT(*)::bigint AS "txCount", COALESCE(SUM("amount"), 0)::text AS "volume"
        FROM "Transaction"
        WHERE "status" = 'SUCCESSFUL'
        GROUP BY "userId"
      `,
      this.prisma.$queryRaw<Array<{ userId: string; count: bigint }>>`
        SELECT "userId", COUNT(*)::bigint AS "count"
        FROM "GiftCardPurchase"
        GROUP BY "userId"
      `,
      this.prisma.$queryRaw<Array<{ userId: string; count: bigint }>>`
        SELECT "userId", COUNT(*)::bigint AS "count"
        FROM "GiftCardSale"
        GROUP BY "userId"
      `,
      this.prisma.$queryRaw<Array<{ userId: string; count: bigint }>>`
        SELECT "referrerId" AS "userId", COUNT(*)::bigint AS "count"
        FROM "ReferralAttribution"
        GROUP BY "referrerId"
      `,
    ]);
    const cardCountByUser = new Map(
      cardCounts.map((row) => [row.userId, Number(row.count)]),
    );
    const balanceByUser = new Map(
      walletBalances.map((row) => [row.userId, Number(row.balance)]),
    );
    const txStatsByUser = new Map(
      txStats.map((row) => [row.userId, { txCount: Number(row.txCount), volume: Number(row.volume) }]),
    );
    const cardPurchasesByUser = new Map(
      cardPurchases.map((row) => [row.userId, Number(row.count)]),
    );
    const cardSalesByUser = new Map(
      cardSales.map((row) => [row.userId, Number(row.count)]),
    );
    const referralsByUser = new Map(
      referralCounts.map((row) => [row.userId, Number(row.count)]),
    );
    let mappedUsers = users.map((user) => {
      const tx = txStatsByUser.get(user.id);
      const txCount = tx?.txCount ?? 0;
      const volume = tx?.volume ?? 0;
      const bought = cardPurchasesByUser.get(user.id) ?? 0;
      const sold = cardSalesByUser.get(user.id) ?? 0;
      const referrals = referralsByUser.get(user.id) ?? 0;
      const points = this.calculateUserPoints({
        transactionCount: txCount,
        cardsBought: bought,
        cardsSold: sold,
        totalVolume: volume,
        referralsCount: referrals,
        isVerified: user.isVerified,
        isEmailVerified: user.isEmailVerified,
      });
      const tierInfo = this.calculateTierInfo(points);

      return this.toAdminUser(
        user,
        cardCountByUser.get(user.id) ?? 0,
        balanceByUser.get(user.id) ?? 0,
        points,
        tierInfo.currentTier,
        tierInfo.dailyLimit,
      );
    });
    if (derivedSort) {
      const key = query.sortBy === 'cards' ? 'cards' : 'balance';
      mappedUsers = mappedUsers.sort((left, right) => {
        const difference = Number(left[key]) - Number(right[key]);
        return query.direction === 'asc' ? difference : -difference;
      });
    }
    return {
      users: derivedSort
        ? mappedUsers.slice((page - 1) * pageSize, page * pageSize)
        : mappedUsers,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
      stats,
      countries: countryRows
        .map((row) => row.country)
        .filter((value): value is string => Boolean(value)),
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
    return {
      id: user.id,
      status: user.isActive
        ? 'Active'
        : normalized === 'BANNED'
          ? 'Banned'
          : 'Suspended',
    };
  }

  async createAdminUser(body: Record<string, unknown>) {
    const email = String(body.email ?? '')
      .trim()
      .toLowerCase();
    const password = String(body.password ?? '');
    if (!email || !password)
      throw new BadRequestException('Email and password are required.');
    const fullName = String(body.fullName ?? '')
      .trim()
      .split(/\s+/);
    const isVerified = body.kycStatus === 'Verified';
    const isEmailVerified = isVerified || body.kycStatus === 'Pending' || body.status !== 'Pending';
    const isActive = body.status !== 'Suspended' && body.status !== 'Banned';

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: await bcrypt.hash(password, 12),
          firstName: fullName.shift() ?? '',
          lastName: fullName.join(' '),
          referralCode: randomBytes(6).toString('hex').slice(0, 10).toUpperCase(),
          username: this.optionalString(body.username)?.replace(/^@/, '') || null,
          phone: this.optionalString(body.phone),
          country: this.optionalString(body.country),
          gender: this.optionalString(body.gender),
          dateOfBirth: body.dateOfBirth ? new Date(String(body.dateOfBirth)) : null,
          address: this.optionalString(body.address),
          isEmailVerified,
          isVerified,
          isActive,
        },
        select: { id: true },
      });
      return { id: user.id, created: true };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        const target = error?.meta?.target;
        const field = Array.isArray(target) ? target.join(', ') : 'field';
        throw new BadRequestException(`A user with this ${field} already exists.`);
      }
      throw error;
    }
  }

  async updateAdminUser(id: string, body: Record<string, unknown>) {
    const fullName = String(body.fullName ?? '')
      .trim()
      .split(/\s+/);
    const isVerified = body.kycStatus === 'Verified';
    const isEmailVerified = isVerified || body.kycStatus === 'Pending' || body.status !== 'Pending';
    const isActive = body.status !== 'Suspended' && body.status !== 'Banned';

    const data: Record<string, unknown> = {
      firstName: fullName.shift() ?? '',
      lastName: fullName.join(' '),
      username: this.optionalString(body.username)?.replace(/^@/, '') || null,
      phone: this.optionalString(body.phone),
      country: this.optionalString(body.country),
      gender: this.optionalString(body.gender),
      isEmailVerified,
      isVerified,
      isActive,
    };
    if (body.email) {
      data.email = String(body.email).trim().toLowerCase();
    }
    if (body.dateOfBirth !== undefined) {
      data.dateOfBirth = body.dateOfBirth ? new Date(String(body.dateOfBirth)) : null;
    }
    if (body.address !== undefined) {
      data.address = this.optionalString(body.address);
    }
    if (body.password) {
      data.passwordHash = await bcrypt.hash(String(body.password), 12);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: { id: true },
      });
      return { id: user.id, updated: true };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        const target = error?.meta?.target;
        const field = Array.isArray(target) ? target.join(', ') : 'field';
        throw new BadRequestException(`A user with this ${field} already exists.`);
      }
      throw error;
    }
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

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalUsersThirtyDaysAgo,
      activeUsers,
      activeUsersThirtyDaysAgo,
      newUsersToday,
      newUsersYesterday,
      pendingVerification,
      suspendedUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: true, createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.user.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
      this.prisma.user.count({ where: { isVerified: false } }),
      this.prisma.user.count({ where: { isActive: false } }),
    ]);

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? { change: '+100%', isPositive: true } : { change: '0%', isPositive: true };
      }
      const diff = ((current - previous) / previous) * 100;
      const formatted = Math.abs(diff).toFixed(1);
      return {
        change: `${diff >= 0 ? '+' : '-'}${formatted}%`,
        isPositive: diff >= 0,
      };
    };

    const totalChange = calculateChange(totalUsers, totalUsersThirtyDaysAgo);
    const activeChange = calculateChange(activeUsers, activeUsersThirtyDaysAgo);
    const todayChange = calculateChange(newUsersToday, newUsersYesterday);

    return {
      totalUsers: {
        count: totalUsers,
        change: totalChange.change,
        isPositive: totalChange.isPositive,
        period: 'last month',
      },
      activeUsers: {
        count: activeUsers,
        change: activeChange.change,
        isPositive: activeChange.isPositive,
        period: 'last month',
      },
      newUsersToday: {
        count: newUsersToday,
        change: todayChange.change,
        isPositive: todayChange.isPositive,
        period: 'yesterday',
      },
      pendingVerification: {
        count: pendingVerification,
        change: '',
        isPositive: pendingVerification === 0,
        period: 'live',
      },
      suspendedUsers: {
        count: suspendedUsers,
        change: '',
        isPositive: suspendedUsers === 0,
        period: 'live',
      },
    };
  }

  private toAdminUser(
    user: any,
    cardCount: number,
    balance: number,
    points: number = 0,
    tier: string = 'Bronze',
    dailyLimit: number = 2000,
  ) {
    const fullName =
      `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
    return {
      id: user.id,
      userId: user.id,
      fullName,
      username: user.username ? `@${user.username.replace(/^@/, '')}` : '@N/A',
      email: user.email,
      phone: user.phone ?? 'N/A',
      country: user.country ?? 'N/A',
      gender: user.gender ?? 'N/A',
      dateOfBirth: user.dateOfBirth
        ? (user.dateOfBirth instanceof Date
            ? user.dateOfBirth.toISOString().slice(0, 10)
            : String(user.dateOfBirth).slice(0, 10))
        : 'N/A',
      address: user.address ?? 'N/A',
      kycStatus: user.isVerified
        ? 'Verified'
        : user.isEmailVerified
          ? 'Pending'
          : 'Not Submitted',
      balance,
      cards: cardCount,
      points,
      tier,
      dailyLimit,
      status: !user.isEmailVerified
        ? 'Pending'
        : user.isActive
          ? 'Active'
          : 'Suspended',
      joinedDate: (user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt)).toISOString().slice(0, 10),
      avatar: this.formatAvatarUrl(user.profileImageUrl, fullName),
    };
  }

  private formatAvatarUrl(url: string | null | undefined, name: string) {
    if (!url || !url.trim()) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0D8ABC&color=fff`;
    }
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const backendUrl =
      process.env.API_BASE_URL ||
      process.env.BACKEND_URL ||
      'http://localhost:3000';
    return `${backendUrl.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
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
      throw new BadRequestException(
        'Transaction PIN must be exactly 4 digits.',
      );
    }

    const transactionPinHash = await bcrypt.hash(pin, 12);
    const result = await this.prisma.user.updateMany({
      where: { id: userId, transactionPinHash: null },
      data: {
        transactionPinHash,
        transactionPinFailedAttempts: 0,
        transactionPinLockedUntil: null,
      },
    });

    if (result.count === 0) {
      const user = await this.findById(userId);
      if (!user) throw new NotFoundException('User not found.');
      throw new ConflictException('A transaction PIN already exists.');
    }
  }

  async updateTransactionPin(
    userId: string,
    currentPin: string,
    newPin: string,
  ) {
    if (!/^\d{4}$/.test(currentPin) || !/^\d{4}$/.test(newPin)) {
      throw new BadRequestException(
        'Transaction PIN must be exactly 4 digits.',
      );
    }

    const transactionPinHash = await bcrypt.hash(newPin, 12);
    const updated = await this.prisma.$transaction(async (transaction) => {
      const rows = await transaction.$queryRaw<
        Array<{
          transactionPinHash: string | null;
          transactionPinFailedAttempts: number;
          transactionPinLockedUntil: Date | null;
        }>
      >`
        SELECT "transactionPinHash", "transactionPinFailedAttempts", "transactionPinLockedUntil"
        FROM "User"
        WHERE "id" = ${userId}
        FOR UPDATE
      `;
      const user = rows[0];
      if (!user) throw new NotFoundException('User not found.');
      if (!user.transactionPinHash)
        throw new BadRequestException('Transaction PIN is not configured.');
      if (
        user.transactionPinLockedUntil &&
        user.transactionPinLockedUntil > new Date()
      ) {
        throw new HttpException(
          'Transaction PIN is temporarily locked.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      const valid = await bcrypt.compare(currentPin, user.transactionPinHash);
      if (!valid) {
        const failedAttempts = user.transactionPinFailedAttempts + 1;
        await transaction.user.update({
          where: { id: userId },
          data: {
            transactionPinFailedAttempts: failedAttempts,
            transactionPinLockedUntil:
              failedAttempts >= 5
                ? new Date(Date.now() + 15 * 60 * 1000)
                : null,
          },
        });
        return false;
      }

      await transaction.user.update({
        where: { id: userId },
        data: {
          transactionPinHash,
          transactionPinFailedAttempts: 0,
          transactionPinLockedUntil: null,
        },
      });
      return true;
    });

    if (!updated) throw new BadRequestException('Invalid transaction PIN.');
  }

  async verifyTransactionPin(userId: string, pin: string) {
    if (!/^\d{4}$/.test(pin)) {
      throw new BadRequestException(
        'Transaction PIN must be exactly 4 digits.',
      );
    }

    let role = 'USER';
    try {
      await this.prisma.$transaction(async (transaction) => {
        const rows = await transaction.$queryRaw<
          Array<{
            transactionPinHash: string | null;
            transactionPinFailedAttempts: number;
            transactionPinLockedUntil: Date | null;
            role: string;
          }>
        >`
        SELECT "transactionPinHash", "transactionPinFailedAttempts", "transactionPinLockedUntil", "role"
        FROM "User"
        WHERE "id" = ${userId}
        FOR UPDATE
      `;
        const user = rows[0];
        if (!user) throw new NotFoundException('User not found.');
        role = user.role;
        if (!user.transactionPinHash)
          throw new BadRequestException('Transaction PIN is not configured.');
        if (
          user.transactionPinLockedUntil &&
          user.transactionPinLockedUntil > new Date()
        ) {
          throw new HttpException(
            'Transaction PIN is temporarily locked.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }

        const valid = await bcrypt.compare(pin, user.transactionPinHash);
        if (valid) {
          await transaction.user.update({
            where: { id: userId },
            data: {
              transactionPinFailedAttempts: 0,
              transactionPinLockedUntil: null,
            },
          });
          return;
        }

        const failedAttempts = user.transactionPinFailedAttempts + 1;
        await transaction.user.update({
          where: { id: userId },
          data: {
            transactionPinFailedAttempts: failedAttempts,
            transactionPinLockedUntil:
              failedAttempts >= 5
                ? new Date(Date.now() + 15 * 60 * 1000)
                : null,
          },
        });
        throw new BadRequestException('Invalid transaction PIN.');
      });
    } catch (error) {
      if (
        error instanceof BadRequestException &&
        error.message === 'Invalid transaction PIN.'
      ) {
        await this.recordPinEvent(userId, role, 'FAILED');
      }
      throw error;
    }
    await this.recordPinEvent(userId, role, 'SUCCESS');
    return true;
  }

  private async recordPinEvent(
    userId: string,
    role: string,
    outcome: SecurityAuditEventInput['outcome'],
  ) {
    try {
      await writeSecurityAuditEvent(this.prisma, {
        eventType: 'PIN',
        event:
          outcome === 'SUCCESS'
            ? 'Transaction PIN Verified'
            : 'Transaction PIN Verification Failed',
        outcome,
        actorType: role === 'ADMIN' ? 'ADMIN' : 'USER',
        actorUserId: userId,
        targetUserId: userId,
        description:
          outcome === 'SUCCESS'
            ? 'Transaction PIN verification succeeded.'
            : 'Transaction PIN verification failed.',
      });
    } catch (error) {
      this.logger.error(
        `Unable to persist transaction PIN audit event: ${
          error instanceof Error ? error.message : 'unknown database error'
        }`,
      );
    }
  }

  async requestTransactionPinReset(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found.');

    await this.prisma.transactionPinResetChallenge.deleteMany({
      where: { userId },
    });
    const code = this.newCode();
    await this.prisma.transactionPinResetChallenge.create({
      data: {
        userId,
        codeHash: this.hash(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
    });

    if (!this.email) {
      throw new HttpException(
        'Email delivery is not configured.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    await this.email.sendTransactionPinResetCode(user.email, code);
    return { sent: true };
  }

  async verifyTransactionPinResetCode(userId: string, code: string) {
    if (!/^\d{6}$/.test(code)) {
      throw new BadRequestException(
        'Transaction PIN reset code must be exactly 6 digits.',
      );
    }

    const challenge = await this.prisma.transactionPinResetChallenge.findFirst({
      where: { userId, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!challenge)
      throw new BadRequestException(
        'Invalid or expired transaction PIN reset code.',
      );
    if (challenge.expiresAt <= new Date()) {
      throw new BadRequestException(
        'Invalid or expired transaction PIN reset code.',
      );
    }
    if (
      challenge.verifiedAt &&
      challenge.resetTokenHash &&
      challenge.resetTokenExpiresAt &&
      challenge.resetTokenExpiresAt > new Date()
    ) {
      throw new BadRequestException(
        'This transaction PIN reset code has already been used.',
      );
    }
    if (challenge.attempts >= 5) {
      throw new HttpException(
        'Too many transaction PIN reset attempts.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const valid = this.hash(code) === challenge.codeHash;
    if (!valid) {
      const nextAttempts = challenge.attempts + 1;
      await this.prisma.transactionPinResetChallenge.update({
        where: { id: challenge.id },
        data: { attempts: nextAttempts },
      });
      if (nextAttempts >= 5) {
        throw new HttpException(
          'Too many transaction PIN reset attempts.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new BadRequestException(
        'Invalid or expired transaction PIN reset code.',
      );
    }

    const resetToken = randomBytes(32).toString('base64url');
    const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.transactionPinResetChallenge.update({
      where: { id: challenge.id },
      data: {
        attempts: 0,
        verifiedAt: new Date(),
        resetTokenHash: this.hash(resetToken),
        resetTokenExpiresAt,
      },
    });

    return { verified: true, resetToken };
  }

  async completeTransactionPinReset(
    userId: string,
    resetToken: string,
    pin: string,
    confirmPin: string,
  ) {
    if (!/^\d{4}$/.test(pin)) {
      throw new BadRequestException(
        'Transaction PIN must be exactly 4 digits.',
      );
    }
    if (pin !== confirmPin) {
      throw new BadRequestException(
        'Transaction PIN confirmation does not match.',
      );
    }

    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found.');

    const challenge = await this.prisma.transactionPinResetChallenge.findFirst({
      where: { userId, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (
      !challenge ||
      !challenge.verifiedAt ||
      !challenge.resetTokenHash ||
      !challenge.resetTokenExpiresAt
    ) {
      throw new BadRequestException(
        'Transaction PIN reset session is invalid or expired.',
      );
    }
    if (challenge.resetTokenExpiresAt <= new Date()) {
      throw new BadRequestException(
        'Transaction PIN reset session is invalid or expired.',
      );
    }
    if (this.hash(resetToken) !== challenge.resetTokenHash) {
      throw new BadRequestException(
        'Transaction PIN reset session is invalid or expired.',
      );
    }

    const transactionPinHash = await bcrypt.hash(pin, 12);
    await this.prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: { id: userId },
        data: {
          transactionPinHash,
          transactionPinFailedAttempts: 0,
          transactionPinLockedUntil: null,
        },
      });
      await transaction.transactionPinResetChallenge.update({
        where: { id: challenge.id },
        data: {
          consumedAt: new Date(),
          resetTokenHash: null,
          resetTokenExpiresAt: null,
        },
      });
    });

    return { reset: true };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found.');
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: dto.username, NOT: { id: userId } },
      });
      if (existing)
        throw new ConflictException('That username is already in use.');
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
        ...(dto.bio !== undefined ? { bio: dto.bio.trim() || null } : {}),
        address: dto.address?.trim() || null,
        ...(dto.profileImageUrl !== undefined
          ? { profileImageUrl: dto.profileImageUrl.trim() || null }
          : {}),
        ...(dto.preferredLanguage !== undefined
          ? { preferredLanguage: dto.preferredLanguage.trim() || '1' }
          : {}),
      },
    });
    return this.recalculateProfileCompletion(updated);
  }

  async setProfileImage(userId: string, profileImageUrl: string | null) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found.');
    return this.recalculateProfileCompletion(
      await this.prisma.user.update({
        where: { id: userId },
        data: { profileImageUrl },
      }),
    );
  }

  refreshVerification(user: Awaited<ReturnType<UsersService['findById']>>) {
    if (!user) throw new NotFoundException('User not found.');
    return this.recalculateProfileCompletion(user);
  }

  async getBiometricSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        biometricLoginEnabled: true,
        biometricTransactionEnabled: true,
        biometricType: true,
        rememberDevice: true,
        autoLockTime: true,
        transactionPinHash: true,
      },
    });
    if (!user) throw new NotFoundException('User not found.');
    return {
      biometricLoginEnabled: user.biometricLoginEnabled,
      biometricTransactionEnabled: user.biometricTransactionEnabled,
      biometricType: user.biometricType,
      rememberDevice: user.rememberDevice,
      autoLockTime: user.autoLockTime,
      hasTransactionPin: Boolean(user.transactionPinHash),
    };
  }

  async updateBiometricSettings(
    userId: string,
    dto: UpdateBiometricSettingsDto,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        transactionPinHash: true,
        biometricLoginEnabled: true,
        biometricTransactionEnabled: true,
      },
    });
    if (!user) throw new NotFoundException('User not found.');

    if (dto.biometricTransactionEnabled === true && !user.transactionPinHash) {
      throw new BadRequestException(
        'You must configure a transaction PIN before enabling biometric transaction authorization.',
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.biometricLoginEnabled !== undefined
          ? { biometricLoginEnabled: dto.biometricLoginEnabled }
          : {}),
        ...(dto.biometricTransactionEnabled !== undefined
          ? { biometricTransactionEnabled: dto.biometricTransactionEnabled }
          : {}),
        ...(dto.biometricType !== undefined
          ? { biometricType: dto.biometricType }
          : {}),
        ...(dto.rememberDevice !== undefined
          ? { rememberDevice: dto.rememberDevice }
          : {}),
        ...(dto.autoLockTime !== undefined
          ? { autoLockTime: dto.autoLockTime }
          : {}),
      },
      select: {
        biometricLoginEnabled: true,
        biometricTransactionEnabled: true,
        biometricType: true,
        rememberDevice: true,
        autoLockTime: true,
        transactionPinHash: true,
      },
    });

    try {
      await writeSecurityAuditEvent(this.prisma, {
        eventType: 'Settings',
        event: 'Biometric Settings Updated',
        outcome: 'SUCCESS',
        actorType: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
        actorUserId: user.id,
        targetUserId: user.id,
        description: 'User updated biometric security preferences.',
        ...context,
      });
    } catch (_) {}

    return {
      biometricLoginEnabled: updated.biometricLoginEnabled,
      biometricTransactionEnabled: updated.biometricTransactionEnabled,
      biometricType: updated.biometricType,
      rememberDevice: updated.rememberDevice,
      autoLockTime: updated.autoLockTime,
      hasTransactionPin: Boolean(updated.transactionPinHash),
    };
  }

  async authorizeBiometricTransaction(
    userId: string,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        biometricTransactionEnabled: true,
        transactionPinHash: true,
        transactionPinLockedUntil: true,
      },
    });
    if (!user) throw new NotFoundException('User not found.');
    if (!user.biometricTransactionEnabled) {
      throw new BadRequestException(
        'Biometric transaction authorization is not enabled.',
      );
    }
    if (
      user.transactionPinLockedUntil &&
      user.transactionPinLockedUntil > new Date()
    ) {
      throw new HttpException(
        'Transaction authorization is temporarily locked.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    try {
      await writeSecurityAuditEvent(this.prisma, {
        eventType: 'Biometrics',
        event: 'Biometric Transaction Authorized',
        outcome: 'SUCCESS',
        actorType: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
        actorUserId: user.id,
        targetUserId: user.id,
        description: 'Transaction authorized via biometrics.',
        ...context,
      });
    } catch (_) {}

    return { authorized: true, timestamp: new Date().toISOString() };
  }

  private parseDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
      throw new BadRequestException('Invalid date of birth.');
    return date;
  }

  private newCode() {
    return randomInt(100000, 1_000_000).toString();
  }

  private hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private recalculateProfileCompletion(
    user: Parameters<UsersService['toPublicUser']>[0] & {
      username?: string | null;
      displayName?: string | null;
      dateOfBirth?: Date | null;
      bio?: string | null;
      address?: string | null;
      profileImageUrl?: string | null;
    },
  ) {
    const complete = [
      user.firstName,
      user.lastName,
      user.username,
      user.country,
      user.gender,
    ].every((value) => Boolean(value?.trim()));
    return this.prisma.user.update({
      where: { id: user.id },
      data: { isProfileComplete: complete },
    });
  }

  toPublicUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username?: string | null;
    displayName?: string | null;
    phone: string | null;
    country: string | null;
    countryCode: string | null;
    gender: string | null;
    dateOfBirth?: Date | null;
    bio?: string | null;
    address?: string | null;
    profileImageUrl?: string | null;
    preferredLanguage?: string | null;
    role: string;
    isEmailVerified: boolean;
    isProfileComplete?: boolean;
    isVerified?: boolean;
    transactionPinHash?: string | null;
    biometricLoginEnabled?: boolean;
    biometricTransactionEnabled?: boolean;
    biometricType?: string | null;
    rememberDevice?: boolean;
    autoLockTime?: string;
  }) {
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
      preferredLanguage: user.preferredLanguage ?? '1',
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isProfileComplete: user.isProfileComplete ?? false,
      isVerified: user.isVerified ?? false,
      hasTransactionPin: user.transactionPinHash != null,
      biometricLoginEnabled: user.biometricLoginEnabled ?? false,
      biometricTransactionEnabled: user.biometricTransactionEnabled ?? false,
      biometricType: user.biometricType ?? null,
      rememberDevice: user.rememberDevice ?? false,
      autoLockTime: user.autoLockTime ?? '5 Minutes',
    };
  }

  calculateTierInfo(points: number) {
    const allTiers = [
      { name: 'Bronze', minPoints: 0, maxPoints: 499, dailyLimit: 2000 },
      { name: 'Silver', minPoints: 500, maxPoints: 1499, dailyLimit: 5000 },
      { name: 'Gold', minPoints: 1500, maxPoints: 2999, dailyLimit: 10000 },
      { name: 'Platinum', minPoints: 3000, maxPoints: 7499, dailyLimit: 25000 },
      { name: 'Diamond', minPoints: 7500, maxPoints: 99999, dailyLimit: 50000 },
    ];

    let currentTier = 'Bronze';
    let nextTier = 'Silver';
    let requiredPoints = 500;
    let dailyLimit = 2000;
    let progressPercentage = 0;

    if (points >= 7500) {
      currentTier = 'Diamond';
      nextTier = 'Diamond (Max Tier)';
      requiredPoints = 7500;
      dailyLimit = 50000;
      progressPercentage = 1.0;
    } else if (points >= 3000) {
      currentTier = 'Platinum';
      nextTier = 'Diamond';
      requiredPoints = 7500;
      dailyLimit = 25000;
      progressPercentage = Math.min(1.0, Math.max(0.0, (points - 3000) / (7500 - 3000)));
    } else if (points >= 1500) {
      currentTier = 'Gold';
      nextTier = 'Platinum';
      requiredPoints = 3000;
      dailyLimit = 10000;
      progressPercentage = Math.min(1.0, Math.max(0.0, (points - 1500) / (3000 - 1500)));
    } else if (points >= 500) {
      currentTier = 'Silver';
      nextTier = 'Gold';
      requiredPoints = 1500;
      dailyLimit = 5000;
      progressPercentage = Math.min(1.0, Math.max(0.0, (points - 500) / (1500 - 500)));
    } else {
      currentTier = 'Bronze';
      nextTier = 'Silver';
      requiredPoints = 500;
      dailyLimit = 2000;
      progressPercentage = Math.min(1.0, Math.max(0.0, points / 500));
    }

    return {
      currentTier,
      nextTier,
      currentPoints: points,
      requiredPoints,
      progressPercentage: Number(progressPercentage.toFixed(2)),
      dailyLimit,
      allTiers,
    };
  }

  calculateUserPoints(params: {
    transactionCount: number;
    cardsBought: number;
    cardsSold: number;
    totalVolume: number;
    referralsCount: number;
    isVerified: boolean;
    isEmailVerified: boolean;
  }) {
    let pts = 0;
    pts += params.transactionCount * 15;
    pts += params.cardsBought * 25;
    pts += params.cardsSold * 25;
    pts += Math.floor(params.totalVolume / 10);
    pts += params.referralsCount * 50;
    if (params.isVerified) pts += 200;
    if (params.isEmailVerified) pts += 50;
    return Math.max(0, pts);
  }

  async getUserAccountTier(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        createdAt: true,
        isVerified: true,
        isEmailVerified: true,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      txCount,
      successfulTxs,
      todayTxs,
      cardsBoughtCount,
      cardsSoldCount,
      referralsCount,
    ] = await Promise.all([
      this.prisma.transaction.count({ where: { userId } }),
      this.prisma.transaction.findMany({
        where: { userId, status: 'SUCCESSFUL' },
        select: { amount: true },
      }),
      this.prisma.transaction.findMany({
        where: {
          userId,
          status: 'SUCCESSFUL',
          createdAt: { gte: startOfToday },
        },
        select: { amount: true },
      }),
      this.prisma.giftCardPurchase.count({ where: { userId } }),
      this.prisma.giftCardSale.count({ where: { userId } }),
      this.prisma.referralAttribution.count({ where: { referrerId: userId } }),
    ]);

    const totalVolume = successfulTxs.reduce(
      (sum, tx) => sum + Number(tx.amount || 0),
      0,
    );
    const todayVolume = todayTxs.reduce(
      (sum, tx) => sum + Number(tx.amount || 0),
      0,
    );

    const points = this.calculateUserPoints({
      transactionCount: txCount,
      cardsBought: cardsBoughtCount,
      cardsSold: cardsSoldCount,
      totalVolume,
      referralsCount,
      isVerified: user.isVerified,
      isEmailVerified: user.isEmailVerified,
    });

    const tierInfo = this.calculateTierInfo(points);
    const remainingDailyLimit = Math.max(0, tierInfo.dailyLimit - todayVolume);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const createdDate = new Date(user.createdAt);
    const memberSince = `${monthNames[createdDate.getMonth()]} ${createdDate.getDate()}, ${createdDate.getFullYear()}`;

    const now = new Date();
    const diffMonths =
      (now.getFullYear() - createdDate.getFullYear()) * 12 +
      (now.getMonth() - createdDate.getMonth());
    let durationString = '';
    if (diffMonths >= 12) {
      const years = Math.floor(diffMonths / 12);
      const rem = diffMonths % 12;
      durationString = `${years} year${years > 1 ? 's' : ''}${rem > 0 ? `, ${rem} month${rem > 1 ? 's' : ''}` : ''}`;
    } else {
      const months = Math.max(diffMonths, 1);
      durationString = `${months} month${months > 1 ? 's' : ''}`;
    }

    return {
      currentTier: tierInfo.currentTier,
      nextTier: tierInfo.nextTier,
      currentPoints: tierInfo.currentPoints,
      requiredPoints: tierInfo.requiredPoints,
      progressPercentage: tierInfo.progressPercentage,
      dailyLimit: tierInfo.dailyLimit,
      remainingDailyLimit,
      stats: {
        totalPoints: points,
        memberSince,
        memberDuration: durationString,
        successfulTransactions: successfulTxs.length,
        totalVolume,
      },
      allTiers: tierInfo.allTiers,
    };
  }

  async getUserProfileStats(userId: string) {
    const [txCount, cardsBought, cardsSold, walletBalances] = await Promise.all([
      this.prisma.transaction.count({ where: { userId } }),
      this.prisma.giftCardPurchase.count({ where: { userId } }),
      this.prisma.giftCardSale.count({ where: { userId } }),
      this.prisma.$queryRaw<Array<{ balance: string }>>`
        SELECT COALESCE(SUM(wb."availableBalance"), 0)::text AS "balance"
        FROM "Wallet" w
        JOIN "WalletBalance" wb ON wb."walletId" = w."id"
        WHERE w."userId" = ${userId} AND wb."currencyCode" = 'USD'
      `,
    ]);

    const walletBalance = walletBalances.length > 0 ? Number(walletBalances[0].balance) : 0;

    return {
      totalTransactions: txCount,
      giftCardsBought: cardsBought,
      giftCardsSold: cardsSold,
      walletBalance,
      currency: 'USD',
    };
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isActive: true },
    });
    if (!user) throw new NotFoundException('User not found.');

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        refreshTokenHash: null,
      },
    });

    await writeSecurityAuditEvent(this.prisma, {
      eventType: 'ACCOUNT_DEACTIVATED',
      event: 'USER_ACCOUNT_DEACTIVATED',
      outcome: 'SUCCESS',
      actorType: 'USER',
      actorUserId: userId,
      targetUserId: userId,
      description: `User account ${user.email} was deactivated by user request.`,
    });

    return { success: true, message: 'Account deactivated successfully.' };
  }
}

