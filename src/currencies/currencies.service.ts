import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async listCurrencies() {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM "Currency" WHERE "enabled" = true ORDER BY "name" ASC
    `;
    return result;
  }

  async getCurrency(code: string) {
    const normalizedCode = code.toUpperCase();
    const result = await this.prisma.$queryRaw`
      SELECT * FROM "Currency" WHERE "code" = ${normalizedCode}
    ` as any[];
    
    if (!result || result.length === 0) {
      throw new NotFoundException(`Currency ${normalizedCode} was not found.`);
    }
    return result[0];
  }

  async ensureCurrency(code: string, defaults?: Partial<{ name: string; symbol: string; country: string; flag: string; enabled: boolean; depositEnabled: boolean }>) {
    const normalizedCode = code.toUpperCase();
    const result = await this.prisma.$queryRaw`
      SELECT * FROM "Currency" WHERE "code" = ${normalizedCode}
    ` as any[];
    
    if (result && result.length > 0) {
      return result[0];
    }

    // Create new currency
    const inserted = await this.prisma.$executeRaw`
      INSERT INTO "Currency" (code, name, symbol, country, flag, enabled, "depositEnabled")
      VALUES (${normalizedCode}, ${defaults?.name ?? normalizedCode}, ${defaults?.symbol ?? normalizedCode}, ${defaults?.country ?? null}, ${defaults?.flag ?? null}, ${defaults?.enabled ?? true}, ${defaults?.depositEnabled ?? false})
    `;
  }
}
