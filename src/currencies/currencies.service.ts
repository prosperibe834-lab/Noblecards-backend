import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async listCurrencies() {
    const prisma = this.prisma as any;
    return prisma.currency.findMany({
      where: { enabled: true },
      orderBy: { name: 'asc' },
    });
  }

  async getCurrency(code: string) {
    const prisma = this.prisma as any;
    const currency = await prisma.currency.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!currency) throw new NotFoundException(`Currency ${code.toUpperCase()} was not found.`);
    return currency;
  }

  async ensureCurrency(code: string, defaults?: Partial<{ name: string; symbol: string; country: string; flag: string; enabled: boolean; depositEnabled: boolean }>) {
    const prisma = this.prisma as any;
    const normalizedCode = code.toUpperCase();
    const existing = await prisma.currency.findUnique({ where: { code: normalizedCode } });
    if (existing) return existing;

    return prisma.currency.create({
      data: {
        code: normalizedCode,
        name: defaults?.name ?? normalizedCode,
        symbol: defaults?.symbol ?? normalizedCode,
        country: defaults?.country ?? null,
        flag: defaults?.flag ?? null,
        enabled: defaults?.enabled ?? true,
        depositEnabled: defaults?.depositEnabled ?? false,
      },
    });
  }
}
