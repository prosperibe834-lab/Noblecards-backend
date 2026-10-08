import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('gift-cards')
@UseGuards(AuthGuard)
export class GiftCardOrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('orders')
  async getUserOrders(@Req() request: { user: { userId: string } }) {
    const userId = request.user.userId;
    const [purchases, sales] = await Promise.all([
      (this.prisma as any).giftCardPurchase.findMany({
        where: { userId },
        select: {
          id: true,
          reference: true,
          status: true,
          provider: true,
          brandNameSnapshot: true,
          productNameSnapshot: true,
          countryCode: true,
          currencyCode: true,
          amount: true,
          quantity: true,
          customerPrice: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      (this.prisma as any).giftCardSale.findMany({
        where: { userId },
        select: {
          id: true,
          status: true,
          provider: true,
          slug: true,
          brandNameSnapshot: true,
          cardCountry: true,
          cardCurrency: true,
          cardAmount: true,
          quotedPayoutAmount: true,
          finalPayoutAmount: true,
          payoutCurrency: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items: [
        ...purchases.map((purchase: Record<string, unknown>) => ({
          ...purchase,
          transactionType: 'buy',
        })),
        ...sales.map((sale: Record<string, unknown>) => ({
          ...sale,
          transactionType: 'sell',
        })),
      ],
      purchases,
      sales,
    };
  }
}