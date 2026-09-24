import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGiftCardsGuard } from './admin-gift-cards.guard';
import { AdminGiftCardSandboxTestDto, BulkGiftCardRateAdjustmentDto, CreateGiftCardRateAdjustmentDto, UpdateGiftCardRateAdjustmentDto } from './gift-cards.dto';
import { AdminGiftCardSandboxService } from './admin-gift-card-sandbox.service';
import { GiftCardsService } from './gift-cards.service';

@Controller('admin/gift-cards')
@UseGuards(AuthGuard, AdminGiftCardsGuard)
export class AdminGiftCardsController {
  constructor(
    private readonly giftCards: GiftCardsService,
    private readonly sandbox: AdminGiftCardSandboxService,
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
}