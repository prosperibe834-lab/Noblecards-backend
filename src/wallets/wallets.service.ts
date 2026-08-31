import { Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateWallet(userId: string) {
    const prisma = this.prisma as any;
    return prisma.wallet.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async getWallet(userId: string) {
    const prisma = this.prisma as any;
    const wallet = await this.getOrCreateWallet(userId);
    const balances = await prisma.walletBalance.findMany({
      where: { walletId: wallet.id },
      include: { currency: true },
      orderBy: { currencyCode: 'asc' },
    });

    return {
      wallet: {
        id: wallet.id,
        userId: wallet.userId,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
      balances: balances.map((balance) => ({
        id: balance.id,
        currency: balance.currencyCode,
        currencyName: balance.currency.name,
        symbol: balance.currency.symbol,
        availableBalance: balance.availableBalance.toString(),
        pendingBalance: balance.pendingBalance.toString(),
        updatedAt: balance.updatedAt,
      })),
    };
  }

  async getBalances(userId: string) {
    const prisma = this.prisma as any;
    const wallet = await this.getOrCreateWallet(userId);
    const balances = await prisma.walletBalance.findMany({
      where: { walletId: wallet.id },
      include: { currency: true },
      orderBy: { currencyCode: 'asc' },
    });

    return balances.map((item) => ({
      id: item.id,
      walletId: item.walletId,
      currency: item.currencyCode,
      name: item.currency.name,
      symbol: item.currency.symbol,
      availableBalance: item.availableBalance.toString(),
      pendingBalance: item.pendingBalance.toString(),
      updatedAt: item.updatedAt,
    }));
  }

  async getWalletById(walletId: string) {
    const prisma = this.prisma as any;
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found.');
    return wallet;
  }

  async ensureBalance(walletId: string, currencyCode: string) {
    const prisma = this.prisma as any;
    const existing = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId, currencyCode } },
      include: { currency: true },
    });

    if (existing) return existing;

    const currency = await prisma.currency.findUnique({ where: { code: currencyCode } });
    if (!currency) throw new NotFoundException(`Currency ${currencyCode} is not configured.`);

    return prisma.walletBalance.create({
      data: {
        walletId,
        currencyCode,
        availableBalance: new Decimal(0),
        pendingBalance: new Decimal(0),
      },
      include: { currency: true },
    });
  }
}
