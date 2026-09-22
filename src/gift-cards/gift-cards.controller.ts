import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { BuyGiftCardCatalogQueryDto } from './buy-gift-card.dto';
import { BuyGiftCardService } from './buy-gift-card.service';
import { QuoteGiftCardSaleDto, SubmitGiftCardSaleDto } from './gift-cards.dto';
import { GiftCardsService } from './gift-cards.service';

@Controller('gift-cards')
@UseGuards(AuthGuard)
export class GiftCardsController {
  constructor(
    private readonly giftCards: GiftCardsService,
    private readonly buyGiftCards: BuyGiftCardService,
  ) {}

  @Get('buy/catalog')
  getBuyCatalog(@Query() query: BuyGiftCardCatalogQueryDto) {
    return this.buyGiftCards.getCatalog({
      countryCode: query.country,
      currency: query.currency,
      productName: query.product,
    });
  }

  @Get('sell/catalog')
  getSellCatalog() {
    return this.giftCards.getSellCatalog();
  }

  @Get('sell/rates')
  getSellRates() {
    return this.giftCards.getSellRates();
  }

  @Post('sell/quote')
  quoteSell(@Body() dto: QuoteGiftCardSaleDto) {
    return this.giftCards.quoteSell(dto);
  }

  @Post('sell')
  submitSell(@Req() request: { user: { userId: string } }, @Body() dto: SubmitGiftCardSaleDto) {
    return this.giftCards.submitSell(request.user.userId, dto);
  }

  @Get('sell/:id')
  getUserSale(@Req() request: { user: { userId: string } }, @Param('id') id: string) {
    return this.giftCards.getUserSale(request.user.userId, id);
  }
}
