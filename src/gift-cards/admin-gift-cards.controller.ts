import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGiftCardsGuard } from './admin-gift-cards.guard';
import { AdminGiftCardSandboxTestDto, BulkGiftCardRateAdjustmentDto, CreateGiftCardRateAdjustmentDto, UpdateGiftCardRateAdjustmentDto } from './gift-cards.dto';
import { BulkBuyGiftCardRateAdjustmentDto, CreateBuyGiftCardBaseRateDto, CreateBuyGiftCardRateAdjustmentDto, UpdateBuyGiftCardBaseRateDto, UpdateBuyGiftCardRateAdjustmentDto } from './buy-gift-card.dto';
import { AdminGiftCardSandboxService } from './admin-gift-card-sandbox.service';
import { BuyGiftCardBaseRateService } from './buy-gift-card-base-rate.service';
import { BuyGiftCardRateService } from './buy-gift-card-rate.service';
import { GiftCardsService } from './gift-cards.service';

@Controller('admin/gift-cards')
@UseGuards(AuthGuard, AdminGiftCardsGuard)
export class AdminGiftCardsController {
  constructor(
    private readonly giftCards: GiftCardsService,
    private readonly sandbox: AdminGiftCardSandboxService,
    private readonly buyRates: BuyGiftCardRateService,
    private readonly buyBaseRates: BuyGiftCardBaseRateService,
  ) {}

  @Post('buy/sandbox-test')
  runSandboxTest(@Req() request: { user: { userId: string } }, @Body() dto: AdminGiftCardSandboxTestDto) {
    return this.sandbox.purchase(request.user.userId, dto);
  }

  @Get('sales')
  getSales(@Query() query: Record<string, string | undefined>) {
    return this.giftCards.getAdminSales(query);
  }

  @Get('sales/:id')
  getSale(@Param('id') id: string) {
    return this.giftCards.getAdminSale(id);
  }

  @Get('rates')
  getRates() {
    return this.giftCards.getSellRates();
  }

  @Get('catalog')
  getCatalog() {
    return this.giftCards.getAdminCatalog();
  }

  @Get('rate-adjustments')
  getRateAdjustments() {
    return this.giftCards.getRateAdjustments();
  }

  @Post('rate-adjustments')
  createRateAdjustment(@Body() dto: CreateGiftCardRateAdjustmentDto) {
    return this.giftCards.createRateAdjustment(dto);
  }

  @Post('rate-adjustments/bulk')
  bulkRateAdjustment(@Body() dto: BulkGiftCardRateAdjustmentDto) {
    return this.giftCards.bulkRateAdjustment(dto);
  }

  @Patch('rate-adjustments/:id')
  updateRateAdjustment(@Param('id') id: string, @Body() dto: UpdateGiftCardRateAdjustmentDto) {
    return this.giftCards.updateRateAdjustment(id, dto);
  }

  @Delete('rate-adjustments/:id')
  deleteRateAdjustment(@Param('id') id: string) {
    return this.giftCards.deleteRateAdjustment(id);
  }

  @Get('buy/rate-adjustments')
  getBuyRateAdjustments() {
    return this.buyRates.list();
  }

  @Post('buy/rate-adjustments')
  createBuyRateAdjustment(@Body() dto: CreateBuyGiftCardRateAdjustmentDto) {
    return this.buyRates.create(dto);
  }

  @Post('buy/rate-adjustments/bulk')
  bulkBuyRateAdjustment(@Body() dto: BulkBuyGiftCardRateAdjustmentDto) {
    return this.buyRates.bulk(dto);
  }

  @Patch('buy/rate-adjustments/:id')
  updateBuyRateAdjustment(@Param('id') id: string, @Body() dto: UpdateBuyGiftCardRateAdjustmentDto) {
    return this.buyRates.update(id, dto);
  }

  @Post('buy/rate-adjustments/:id/reset')
  resetBuyRateAdjustment(@Param('id') id: string) {
    return this.buyRates.reset(id);
  }

  @Delete('buy/rate-adjustments/:id')
  deleteBuyRateAdjustment(@Param('id') id: string) {
    return this.buyRates.remove(id);
  }

  @Get('buy/base-rates')
  getBuyBaseRates() {
    return this.buyBaseRates.list();
  }

  @Post('buy/base-rates')
  createBuyBaseRate(@Body() dto: CreateBuyGiftCardBaseRateDto) {
    return this.buyBaseRates.create(dto);
  }

  @Patch('buy/base-rates/:id')
  updateBuyBaseRate(@Param('id') id: string, @Body() dto: UpdateBuyGiftCardBaseRateDto) {
    return this.buyBaseRates.update(id, dto);
  }

  @Post('buy/base-rates/:id/reset')
  resetBuyBaseRate(@Param('id') id: string) {
    return this.buyBaseRates.reset(id);
  }
}