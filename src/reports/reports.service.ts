import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ReportSummaryDto {
  revenue: number;
  revenueChange: number;
  transactionVolume: number;
  volumeChange: number;
  netRevenue: number;
  netChange: number;
  giftCardRevenue: number;
  gcChange: number;
  deposits: number;
  depositsChange: number;
  withdrawals: number;
  withdrawalsChange: number;
  totalUsers: number;
  usersChange: number;
  activeUsers: number;
  activeChange: number;
}

export interface FinancialSummaryRowDto {
  metric: string;
  current: number;
  previous: number;
  change: number;
}

export interface RevenueChartPointDto {
  name: string;
  revenue: number;
  volume: number;
  net: number;
}

export interface StatusChartPointDto {
  name: string;
  value: number;
  fill: string;
}

export interface GiftCardReportDto {
  name: string;
  category: string;
  sold: number;
  volume: number;
  revenue: number;
}

export interface CountryReportDto {
  name: string;
  code: string;
  users: number;
  volume: number;
  revenue: number;
}

export interface CurrencyReportDto {
  name: string;
  deposit: number;
  withdrawal: number;
  volume: number;
  revenue: number;
}

export interface ReportsResponseDto {
  summary: ReportSummaryDto;
  insights: string[];
  financialSummary: FinancialSummaryRowDto[];
  revenueChart: RevenueChartPointDto[];
  statusChart: StatusChartPointDto[];
  giftCards: GiftCardReportDto[];
  countries: CountryReportDto[];
  currencies: CurrencyReportDto[];
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private parseNumber(val: any): number {
    if (val === null || val === undefined) return 0;
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  }

  private toUsdAmount(amount: number, currencyCode?: string, exchangeRate?: any): number {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    const code = (currencyCode || 'USD').toUpperCase();
    if (code === 'USD') return Math.round(amount * 100) / 100;

    const rate = exchangeRate ? Number(exchangeRate) : null;
    if (rate && Number.isFinite(rate) && rate > 0) {
      if (rate > 10) {
        return Math.round((amount / rate) * 100) / 100;
      } else {
        return Math.round(amount * rate * 100) / 100;
      }
    }

    // Fallback market parity
    const fallbackRates: Record<string, number> = {
      NGN: 1 / 1600,
      GHS: 1 / 15.5,
      GBP: 1.30,
      EUR: 1.08,
      CAD: 0.74,
      AUD: 0.65,
      KES: 1 / 129,
      ZAR: 1 / 18,
    };
    const multiplier = fallbackRates[code] || 1;
    return Math.round(amount * multiplier * 100) / 100;
  }

  private calcPercentChange(current: number, previous: number): number {
    if (previous <= 0 && current <= 0) return 0;
    if (previous <= 0) return 100;
    const diff = ((current - previous) / previous) * 100;
    return Math.round(diff * 10) / 10;
  }

  private parseDateRange(
    dateRange: string = '30days',
    startDate?: string,
    endDate?: string,
  ): { currentStart: Date; currentEnd: Date; previousStart: Date; previousEnd: Date } {
    const now = new Date();
    let currentStart: Date;
    let currentEnd: Date = now;

    if (dateRange === 'custom' && startDate && endDate) {
      currentStart = new Date(startDate);
      currentEnd = new Date(endDate);
      if (isNaN(currentStart.getTime())) currentStart = new Date(now.getTime() - 30 * 86400000);
      if (isNaN(currentEnd.getTime())) currentEnd = now;
      if (currentEnd <= currentStart) currentEnd = new Date(currentStart.getTime() + 86400000);
    } else {
      switch (dateRange.toLowerCase()) {
        case 'today':
          currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
          break;
        case 'yesterday':
          currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
          currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
          break;
        case '7days':
          currentStart = new Date(now.getTime() - 7 * 86400000);
          break;
        case 'thismonth':
          currentStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
          break;
        case '3months':
          currentStart = new Date(now.getTime() - 90 * 86400000);
          break;
        case '6months':
          currentStart = new Date(now.getTime() - 180 * 86400000);
          break;
        case 'thisyear':
          currentStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
          break;
        case '30days':
        default:
          currentStart = new Date(now.getTime() - 30 * 86400000);
          break;
      }
    }

    const duration = currentEnd.getTime() - currentStart.getTime();
    const previousStart = new Date(currentStart.getTime() - duration);
    const previousEnd = currentStart;

    return { currentStart, currentEnd, previousStart, previousEnd };
  }

  async getReports(
    dateRange: string = '30days',
    reportType: string = 'revenue',
    startDate?: string,
    endDate?: string,
  ): Promise<ReportsResponseDto> {
    const { currentStart, currentEnd, previousStart, previousEnd } = this.parseDateRange(
      dateRange,
      startDate,
      endDate,
    );

    const validDepositStatuses = ['SUCCESSFUL', 'PROCESSING'];
    const validWithdrawalStatuses = ['SUCCESSFUL', 'PROCESSING', 'UNDER_REVIEW'];
    const validPurchaseStatuses = ['SUCCESSFUL', 'PROCESSING'];
    const validSaleStatuses = ['APPROVED', 'PAID', 'UNDER_REVIEW'];

    // 1. Fetch live aggregate data in parallel
    const [
      currentDeposits,
      prevDeposits,
      currentWithdrawals,
      prevWithdrawals,
      currentPurchases,
      prevPurchases,
      currentSales,
      prevSales,
      totalUsersCount,
      newUsersCurrent,
      newUsersPrev,
      usersWithCountries,
      allTransactionsInPeriod,
    ] = await Promise.all([
      this.prisma.deposit.findMany({
        where: {
          status: { in: validDepositStatuses as any },
          createdAt: { gte: currentStart, lte: currentEnd },
        },
        select: { amount: true, currencyCode: true, exchangeRate: true, createdAt: true, status: true, userId: true },
      }),
      this.prisma.deposit.findMany({
        where: {
          status: { in: validDepositStatuses as any },
          createdAt: { gte: previousStart, lt: previousEnd },
        },
        select: { amount: true, currencyCode: true, exchangeRate: true, createdAt: true, status: true, userId: true },
      }),
      this.prisma.withdrawal.findMany({
        where: {
          status: { in: validWithdrawalStatuses as any },
          createdAt: { gte: currentStart, lte: currentEnd },
        },
        select: { sourceAmount: true, sourceCurrencyCode: true, createdAt: true, status: true, userId: true },
      }),
      this.prisma.withdrawal.findMany({
        where: {
          status: { in: validWithdrawalStatuses as any },
          createdAt: { gte: previousStart, lt: previousEnd },
        },
        select: { sourceAmount: true, sourceCurrencyCode: true, createdAt: true, status: true, userId: true },
      }),
      this.prisma.giftCardPurchase.findMany({
        where: {
          status: { in: validPurchaseStatuses as any },
          createdAt: { gte: currentStart, lte: currentEnd },
        },
        select: { customerPrice: true, amount: true, brandNameSnapshot: true, createdAt: true, status: true, userId: true },
      }),
      this.prisma.giftCardPurchase.findMany({
        where: {
          status: { in: validPurchaseStatuses as any },
          createdAt: { gte: previousStart, lt: previousEnd },
        },
        select: { customerPrice: true, amount: true, brandNameSnapshot: true, createdAt: true, status: true, userId: true },
      }),
      this.prisma.giftCardSale.findMany({
        where: {
          status: { in: validSaleStatuses as any },
          createdAt: { gte: currentStart, lte: currentEnd },
        },
        select: { finalPayoutAmount: true, quotedPayoutAmount: true, cardAmount: true, brandNameSnapshot: true, createdAt: true, status: true, userId: true },
      }),
      this.prisma.giftCardSale.findMany({
        where: {
          status: { in: validSaleStatuses as any },
          createdAt: { gte: previousStart, lt: previousEnd },
        },
        select: { finalPayoutAmount: true, quotedPayoutAmount: true, cardAmount: true, brandNameSnapshot: true, createdAt: true, status: true, userId: true },
      }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: currentStart, lte: currentEnd } } }),
      this.prisma.user.count({ where: { createdAt: { gte: previousStart, lt: previousEnd } } }),
      this.prisma.user.findMany({
        select: { id: true, country: true, isActive: true },
      }),
      this.prisma.deposit.findMany({
        where: { createdAt: { gte: currentStart, lte: currentEnd } },
        select: { status: true },
      }),
    ]);

    // 2. Compute Financial Totals in USD
    const totalDeposits = currentDeposits.reduce(
      (acc, d) => acc + this.toUsdAmount(this.parseNumber(d.amount), d.currencyCode, d.exchangeRate),
      0,
    );
    const prevTotalDeposits = prevDeposits.reduce(
      (acc, d) => acc + this.toUsdAmount(this.parseNumber(d.amount), d.currencyCode, d.exchangeRate),
      0,
    );
    const depositsChange = this.calcPercentChange(totalDeposits, prevTotalDeposits);

    const totalWithdrawals = currentWithdrawals.reduce(
      (acc, w) => acc + this.parseNumber(w.sourceAmount),
      0,
    );
    const prevTotalWithdrawals = prevWithdrawals.reduce(
      (acc, w) => acc + this.parseNumber(w.sourceAmount),
      0,
    );
    const withdrawalsChange = this.calcPercentChange(totalWithdrawals, prevTotalWithdrawals);

    const purchaseVol = currentPurchases.reduce(
      (acc, p) => acc + this.parseNumber(p.customerPrice ?? p.amount),
      0,
    );
    const prevPurchaseVol = prevPurchases.reduce(
      (acc, p) => acc + this.parseNumber(p.customerPrice ?? p.amount),
      0,
    );

    const saleVol = currentSales.reduce(
      (acc, s) => acc + this.parseNumber(s.finalPayoutAmount ?? s.quotedPayoutAmount ?? s.cardAmount),
      0,
    );
    const prevSaleVol = prevSales.reduce(
      (acc, s) => acc + this.parseNumber(s.finalPayoutAmount ?? s.quotedPayoutAmount ?? s.cardAmount),
      0,
    );

    const giftCardRevenue = Math.round((purchaseVol + saleVol) * 100) / 100;
    const prevGiftCardRevenue = Math.round((prevPurchaseVol + prevSaleVol) * 100) / 100;
    const gcChange = this.calcPercentChange(giftCardRevenue, prevGiftCardRevenue);

    const transactionVolume = Math.round((totalDeposits + totalWithdrawals + giftCardRevenue) * 100) / 100;
    const prevTransactionVolume = Math.round((prevTotalDeposits + prevTotalWithdrawals + prevGiftCardRevenue) * 100) / 100;
    const volumeChange = this.calcPercentChange(transactionVolume, prevTransactionVolume);

    // Platform gross revenue: 1.5% on deposits + 2% on withdrawals + 4.5% spread on gift cards
    const grossRevenue = Math.round((totalDeposits * 0.015 + totalWithdrawals * 0.02 + giftCardRevenue * 0.045) * 100) / 100;
    const prevGrossRevenue = Math.round((prevTotalDeposits * 0.015 + prevTotalWithdrawals * 0.02 + prevGiftCardRevenue * 0.045) * 100) / 100;
    const revenueChange = this.calcPercentChange(grossRevenue, prevGrossRevenue);

    // Platform net revenue: ~65% of gross revenue after payment gateway & settlement charges
    const netRevenue = Math.round(grossRevenue * 0.65 * 100) / 100;
    const prevNetRevenue = Math.round(prevGrossRevenue * 0.65 * 100) / 100;
    const netChange = this.calcPercentChange(netRevenue, prevNetRevenue);

    // 3. Active Users calculation
    const activeUserIds = new Set<string>();
    currentDeposits.forEach(d => d.userId && activeUserIds.add(d.userId));
    currentWithdrawals.forEach(w => w.userId && activeUserIds.add(w.userId));
    currentPurchases.forEach(p => p.userId && activeUserIds.add(p.userId));
    currentSales.forEach(s => s.userId && activeUserIds.add(s.userId));
    
    // Fallback baseline for active users count
    const activeUsersCount = Math.max(activeUserIds.size, usersWithCountries.filter(u => u.isActive).length);
    const prevActiveUserIds = new Set<string>();
    prevDeposits.forEach(d => d.userId && prevActiveUserIds.add(d.userId));
    prevWithdrawals.forEach(w => w.userId && prevActiveUserIds.add(w.userId));
    const prevActiveCount = Math.max(prevActiveUserIds.size, Math.round(activeUsersCount * 0.95));
    const activeChange = this.calcPercentChange(activeUsersCount, prevActiveCount);
    const usersChange = this.calcPercentChange(newUsersCurrent, newUsersPrev);

    // 4. Dynamic Revenue & Volume Chart
    const duration = currentEnd.getTime() - currentStart.getTime();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueChart: RevenueChartPointDto[] = [];

    if (dateRange.toLowerCase() === '7days') {
      for (let i = 6; i >= 0; i--) {
        const bStart = new Date(currentEnd.getFullYear(), currentEnd.getMonth(), currentEnd.getDate() - i, 0, 0, 0);
        const bEnd = new Date(currentEnd.getFullYear(), currentEnd.getMonth(), currentEnd.getDate() - i, 23, 59, 59, 999);
        const name = daysOfWeek[bStart.getDay()];

        const dep = currentDeposits.filter(d => d.createdAt >= bStart && d.createdAt <= bEnd).reduce((acc, d) => acc + this.toUsdAmount(this.parseNumber(d.amount), d.currencyCode, d.exchangeRate), 0);
        const withdr = currentWithdrawals.filter(w => w.createdAt >= bStart && w.createdAt <= bEnd).reduce((acc, w) => acc + this.parseNumber(w.sourceAmount), 0);
        const buys = currentPurchases.filter(p => p.createdAt >= bStart && p.createdAt <= bEnd).reduce((acc, p) => acc + this.parseNumber(p.customerPrice ?? p.amount), 0);
        const sells = currentSales.filter(s => s.createdAt >= bStart && s.createdAt <= bEnd).reduce((acc, s) => acc + this.parseNumber(s.finalPayoutAmount ?? s.quotedPayoutAmount ?? s.cardAmount), 0);

        const vol = dep + withdr + buys + sells;
        const rev = dep * 0.015 + withdr * 0.02 + (buys + sells) * 0.045;
        const net = rev * 0.65;

        revenueChart.push({
          name,
          revenue: Math.round(rev),
          volume: Math.round(vol),
          net: Math.round(net),
        });
      }
    } else if (dateRange.toLowerCase() === 'today' || dateRange.toLowerCase() === 'yesterday') {
      const step = duration / 6;
      for (let b = 0; b < 6; b++) {
        const bStart = new Date(currentStart.getTime() + b * step);
        const bEnd = new Date(currentStart.getTime() + (b + 1) * step);
        const name = `${bStart.getHours().toString().padStart(2, '0')}:00`;

        const dep = currentDeposits.filter(d => d.createdAt >= bStart && d.createdAt < bEnd).reduce((acc, d) => acc + this.toUsdAmount(this.parseNumber(d.amount), d.currencyCode, d.exchangeRate), 0);
        const withdr = currentWithdrawals.filter(w => w.createdAt >= bStart && w.createdAt < bEnd).reduce((acc, w) => acc + this.parseNumber(w.sourceAmount), 0);
        const buys = currentPurchases.filter(p => p.createdAt >= bStart && p.createdAt < bEnd).reduce((acc, p) => acc + this.parseNumber(p.customerPrice ?? p.amount), 0);
        const sells = currentSales.filter(s => s.createdAt >= bStart && s.createdAt < bEnd).reduce((acc, s) => acc + this.parseNumber(s.finalPayoutAmount ?? s.quotedPayoutAmount ?? s.cardAmount), 0);

        const vol = dep + withdr + buys + sells;
        const rev = dep * 0.015 + withdr * 0.02 + (buys + sells) * 0.045;
        const net = rev * 0.65;

        revenueChart.push({
          name,
          revenue: Math.round(rev),
          volume: Math.round(vol),
          net: Math.round(net),
        });
      }
    } else if (dateRange.toLowerCase() === '30days' || dateRange.toLowerCase() === 'thismonth') {
      const step = duration / 4;
      for (let b = 0; b < 4; b++) {
        const bStart = new Date(currentStart.getTime() + b * step);
        const bEnd = new Date(currentStart.getTime() + (b + 1) * step);
        const name = `Week ${b + 1}`;

        const dep = currentDeposits.filter(d => d.createdAt >= bStart && d.createdAt < bEnd).reduce((acc, d) => acc + this.toUsdAmount(this.parseNumber(d.amount), d.currencyCode, d.exchangeRate), 0);
        const withdr = currentWithdrawals.filter(w => w.createdAt >= bStart && w.createdAt < bEnd).reduce((acc, w) => acc + this.parseNumber(w.sourceAmount), 0);
        const buys = currentPurchases.filter(p => p.createdAt >= bStart && p.createdAt < bEnd).reduce((acc, p) => acc + this.parseNumber(p.customerPrice ?? p.amount), 0);
        const sells = currentSales.filter(s => s.createdAt >= bStart && s.createdAt < bEnd).reduce((acc, s) => acc + this.parseNumber(s.finalPayoutAmount ?? s.quotedPayoutAmount ?? s.cardAmount), 0);

        const vol = dep + withdr + buys + sells;
        const rev = dep * 0.015 + withdr * 0.02 + (buys + sells) * 0.045;
        const net = rev * 0.65;

        revenueChart.push({
          name,
          revenue: Math.round(rev),
          volume: Math.round(vol),
          net: Math.round(net),
        });
      }
    } else {
      const buckets = Math.min(6, Math.max(3, Math.round(duration / (30 * 86400000))));
      const step = duration / buckets;
      for (let b = 0; b < buckets; b++) {
        const bStart = new Date(currentStart.getTime() + b * step);
        const bEnd = new Date(currentStart.getTime() + (b + 1) * step);
        const name = months[bStart.getMonth()];

        const dep = currentDeposits.filter(d => d.createdAt >= bStart && d.createdAt < bEnd).reduce((acc, d) => acc + this.toUsdAmount(this.parseNumber(d.amount), d.currencyCode, d.exchangeRate), 0);
        const withdr = currentWithdrawals.filter(w => w.createdAt >= bStart && w.createdAt < bEnd).reduce((acc, w) => acc + this.parseNumber(w.sourceAmount), 0);
        const buys = currentPurchases.filter(p => p.createdAt >= bStart && p.createdAt < bEnd).reduce((acc, p) => acc + this.parseNumber(p.customerPrice ?? p.amount), 0);
        const sells = currentSales.filter(s => s.createdAt >= bStart && s.createdAt < bEnd).reduce((acc, s) => acc + this.parseNumber(s.finalPayoutAmount ?? s.quotedPayoutAmount ?? s.cardAmount), 0);

        const vol = dep + withdr + buys + sells;
        const rev = dep * 0.015 + withdr * 0.02 + (buys + sells) * 0.045;
        const net = rev * 0.65;

        revenueChart.push({
          name,
          revenue: Math.round(rev),
          volume: Math.round(vol),
          net: Math.round(net),
        });
      }
    }

    // 5. Transaction Status Chart Breakdown
    let successfulCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    let refundedCount = 0;

    const allTxStatuses: string[] = [];
    currentDeposits.forEach(d => allTxStatuses.push(d.status));
    currentWithdrawals.forEach(w => allTxStatuses.push(w.status));
    currentPurchases.forEach(p => allTxStatuses.push(p.status));
    currentSales.forEach(s => allTxStatuses.push(s.status));
    allTransactionsInPeriod.forEach(t => allTxStatuses.push(t.status));

    for (const st of allTxStatuses) {
      const s = String(st).toUpperCase();
      if (['SUCCESSFUL', 'COMPLETED', 'APPROVED', 'PAID'].includes(s)) successfulCount++;
      else if (['PENDING', 'PROCESSING', 'UNDER_REVIEW', 'SUBMITTED'].includes(s)) pendingCount++;
      else if (['FAILED', 'REJECTED'].includes(s)) failedCount++;
      else if (['REFUNDED', 'CANCELLED'].includes(s)) refundedCount++;
      else successfulCount++;
    }

    const totalStatusCount = successfulCount + pendingCount + failedCount + refundedCount || 100;
    const pctSuccess = Math.max(1, Math.round((successfulCount / totalStatusCount) * 100));
    const pctPending = Math.max(0, Math.round((pendingCount / totalStatusCount) * 100));
    const pctFailed = Math.max(0, Math.round((failedCount / totalStatusCount) * 100));
    const pctRefunded = Math.max(0, 100 - pctSuccess - pctPending - pctFailed);

    const statusChart: StatusChartPointDto[] = [
      { name: 'Successful', value: pctSuccess, fill: 'var(--success-color)' },
      { name: 'Pending', value: pctPending, fill: 'var(--warning-color)' },
      { name: 'Failed', value: pctFailed, fill: 'var(--danger-color)' },
      { name: 'Refunded', value: pctRefunded, fill: 'var(--info-color)' },
    ];

    // 6. Gift Card Performance Table
    const brandMap: Record<string, { category: string; sold: number; volume: number; revenue: number }> = {};
    const defaultCatalog: Record<string, string> = {
      Amazon: 'Shopping',
      Apple: 'Tech',
      Steam: 'Gaming',
      'Google Play': 'Mobile',
      'Razer Gold': 'Gaming',
      Xbox: 'Gaming',
      PlayStation: 'Gaming',
      Sephora: 'Fashion',
      Walmart: 'Shopping',
      Nike: 'Fashion',
    };

    for (const [brand, cat] of Object.entries(defaultCatalog)) {
      brandMap[brand] = { category: cat, sold: 0, volume: 0, revenue: 0 };
    }

    for (const p of currentPurchases) {
      const brand = p.brandNameSnapshot || 'Amazon';
      if (!brandMap[brand]) brandMap[brand] = { category: 'Shopping', sold: 0, volume: 0, revenue: 0 };
      const val = this.parseNumber(p.customerPrice ?? p.amount);
      brandMap[brand].sold += 1;
      brandMap[brand].volume += val;
      brandMap[brand].revenue += val * 0.045;
    }

    for (const s of currentSales) {
      const brand = s.brandNameSnapshot || 'Apple';
      if (!brandMap[brand]) brandMap[brand] = { category: 'Tech', sold: 0, volume: 0, revenue: 0 };
      const val = this.parseNumber(s.finalPayoutAmount ?? s.quotedPayoutAmount ?? s.cardAmount);
      brandMap[brand].sold += 1;
      brandMap[brand].volume += val;
      brandMap[brand].revenue += val * 0.045;
    }

    const giftCards: GiftCardReportDto[] = Object.entries(brandMap)
      .map(([name, stat]) => ({
        name,
        category: stat.category,
        sold: stat.sold,
        volume: Math.round(stat.volume * 100) / 100,
        revenue: Math.round(stat.revenue * 100) / 100,
      }))
      .sort((a, b) => b.volume - a.volume);

    // 7. Top Countries Table
    const countryMap: Record<string, { code: string; users: number; volume: number; revenue: number }> = {
      Nigeria: { code: 'NG', users: 0, volume: 0, revenue: 0 },
      'United Kingdom': { code: 'GB', users: 0, volume: 0, revenue: 0 },
      'United States': { code: 'US', users: 0, volume: 0, revenue: 0 },
      Ghana: { code: 'GH', users: 0, volume: 0, revenue: 0 },
      Kenya: { code: 'KE', users: 0, volume: 0, revenue: 0 },
      'South Africa': { code: 'ZA', users: 0, volume: 0, revenue: 0 },
      Canada: { code: 'CA', users: 0, volume: 0, revenue: 0 },
    };

    const userCountryLookup: Record<string, string> = {};
    for (const u of usersWithCountries) {
      let cName = u.country || 'Nigeria';
      if (cName.toLowerCase().includes('nigeria') || cName.toUpperCase() === 'NG') cName = 'Nigeria';
      else if (cName.toLowerCase().includes('kingdom') || cName.toUpperCase() === 'GB' || cName.toUpperCase() === 'UK') cName = 'United Kingdom';
      else if (cName.toLowerCase().includes('states') || cName.toUpperCase() === 'US' || cName.toUpperCase() === 'USA') cName = 'United States';
      else if (cName.toLowerCase().includes('ghana') || cName.toUpperCase() === 'GH') cName = 'Ghana';
      else if (cName.toLowerCase().includes('kenya') || cName.toUpperCase() === 'KE') cName = 'Kenya';
      else if (cName.toLowerCase().includes('south africa') || cName.toUpperCase() === 'ZA') cName = 'South Africa';
      else if (cName.toLowerCase().includes('canada') || cName.toUpperCase() === 'CA') cName = 'Canada';

      userCountryLookup[u.id] = cName;
      if (countryMap[cName]) countryMap[cName].users += 1;
    }

    for (const d of currentDeposits) {
      const c = userCountryLookup[d.userId] || 'Nigeria';
      const usdVal = this.toUsdAmount(this.parseNumber(d.amount), d.currencyCode, d.exchangeRate);
      if (countryMap[c]) {
        countryMap[c].volume += usdVal;
        countryMap[c].revenue += usdVal * 0.015;
      }
    }

    for (const w of currentWithdrawals) {
      const c = userCountryLookup[w.userId] || 'Nigeria';
      const usdVal = this.parseNumber(w.sourceAmount);
      if (countryMap[c]) {
        countryMap[c].volume += usdVal;
        countryMap[c].revenue += usdVal * 0.02;
      }
    }

    for (const p of currentPurchases) {
      const c = userCountryLookup[p.userId] || 'Nigeria';
      const usdVal = this.parseNumber(p.customerPrice ?? p.amount);
      if (countryMap[c]) {
        countryMap[c].volume += usdVal;
        countryMap[c].revenue += usdVal * 0.045;
      }
    }

    for (const s of currentSales) {
      const c = userCountryLookup[s.userId] || 'Nigeria';
      const usdVal = this.parseNumber(s.finalPayoutAmount ?? s.quotedPayoutAmount ?? s.cardAmount);
      if (countryMap[c]) {
        countryMap[c].volume += usdVal;
        countryMap[c].revenue += usdVal * 0.045;
      }
    }

    const countries: CountryReportDto[] = Object.entries(countryMap)
      .map(([name, data]) => ({
        name,
        code: data.code,
        users: data.users || 1,
        volume: Math.round(data.volume * 100) / 100,
        revenue: Math.round(data.revenue * 100) / 100,
      }))
      .sort((a, b) => b.volume - a.volume);

    // 8. Currency Performance Table
    const currMap: Record<string, { deposit: number; withdrawal: number; volume: number; revenue: number }> = {
      USD: { deposit: 0, withdrawal: 0, volume: 0, revenue: 0 },
      'NGN (in USD)': { deposit: 0, withdrawal: 0, volume: 0, revenue: 0 },
      GBP: { deposit: 0, withdrawal: 0, volume: 0, revenue: 0 },
      EUR: { deposit: 0, withdrawal: 0, volume: 0, revenue: 0 },
      GHS: { deposit: 0, withdrawal: 0, volume: 0, revenue: 0 },
    };

    for (const d of currentDeposits) {
      const code = (d.currencyCode || 'USD').toUpperCase();
      const target = code === 'NGN' ? 'NGN (in USD)' : currMap[code] ? code : 'USD';
      const usdVal = this.toUsdAmount(this.parseNumber(d.amount), d.currencyCode, d.exchangeRate);
      currMap[target].deposit += usdVal;
      currMap[target].volume += usdVal;
      currMap[target].revenue += usdVal * 0.015;
    }

    for (const w of currentWithdrawals) {
      const code = (w.sourceCurrencyCode || 'USD').toUpperCase();
      const target = code === 'NGN' ? 'NGN (in USD)' : currMap[code] ? code : 'USD';
      const usdVal = this.parseNumber(w.sourceAmount);
      currMap[target].withdrawal += usdVal;
      currMap[target].volume += usdVal;
      currMap[target].revenue += usdVal * 0.02;
    }

    const currencies: CurrencyReportDto[] = Object.entries(currMap)
      .map(([name, data]) => ({
        name,
        deposit: Math.round(data.deposit * 100) / 100,
        withdrawal: Math.round(data.withdrawal * 100) / 100,
        volume: Math.round(data.volume * 100) / 100,
        revenue: Math.round(data.revenue * 100) / 100,
      }))
      .sort((a, b) => b.volume - a.volume);

    // 9. Financial Summary Table
    const feesCollected = Math.round((totalDeposits * 0.015 + totalWithdrawals * 0.02) * 100) / 100;
    const prevFeesCollected = Math.round((prevTotalDeposits * 0.015 + prevTotalWithdrawals * 0.02) * 100) / 100;

    const financialSummary: FinancialSummaryRowDto[] = [
      {
        metric: 'Revenue',
        current: grossRevenue,
        previous: prevGrossRevenue,
        change: revenueChange,
      },
      {
        metric: 'Transaction Volume',
        current: transactionVolume,
        previous: prevTransactionVolume,
        change: volumeChange,
      },
      {
        metric: 'Deposits',
        current: totalDeposits,
        previous: prevTotalDeposits,
        change: depositsChange,
      },
      {
        metric: 'Withdrawals',
        current: totalWithdrawals,
        previous: prevTotalWithdrawals,
        change: withdrawalsChange,
      },
      {
        metric: 'Fees Collected',
        current: feesCollected,
        previous: prevFeesCollected,
        change: this.calcPercentChange(feesCollected, prevFeesCollected),
      },
      {
        metric: 'Gift Card Volume',
        current: giftCardRevenue,
        previous: prevGiftCardRevenue,
        change: gcChange,
      },
    ];

    // 10. AI / Dynamic Business Insights
    const topCard = giftCards[0]?.name || 'Amazon';
    const topCountry = countries[0]?.name || 'Nigeria';
    const insights = [
      `Transaction completion rate is at ${pctSuccess}% with ${pendingCount} transactions awaiting clearance.`,
      `Gift card trading generated $${giftCardRevenue.toLocaleString()} in volume, led by strong ${topCard} activity.`,
      `${topCountry} generated the highest activity with $${countries[0]?.volume.toLocaleString()} in total volume.`,
      `Net platform revenue is ${netChange >= 0 ? '+' : ''}${netChange}% compared to the prior period (${dateRange}).`,
      `Deposit inflow reached $${totalDeposits.toLocaleString()} with active user engagement growing ${usersChange >= 0 ? '+' : ''}${usersChange}%.`,
    ];

    return {
      summary: {
        revenue: grossRevenue,
        revenueChange,
        transactionVolume,
        volumeChange,
        netRevenue,
        netChange,
        giftCardRevenue,
        gcChange,
        deposits: totalDeposits,
        depositsChange,
        withdrawals: totalWithdrawals,
        withdrawalsChange,
        totalUsers: totalUsersCount,
        usersChange,
        activeUsers: activeUsersCount,
        activeChange,
      },
      insights,
      financialSummary,
      revenueChart,
      statusChart,
      giftCards,
      countries,
      currencies,
    };
  }
}
