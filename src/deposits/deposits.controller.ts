import { Body, Controller, Get, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/public.decorator';
import { CreateDepositDto } from './deposits.dto';
import { DepositsService } from './deposits.service';

@Controller('deposits')
@UseGuards(AuthGuard)
export class DepositsController {
  private readonly logger = new Logger(DepositsController.name);

  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  async createDeposit(@Req() request: { user: { userId: string } }, @Body() dto: CreateDepositDto) {
    this.logger.log('=== CREATE DEPOSIT START ===');
    this.logger.log(`userId: ${request.user.userId}`);
    this.logger.log(`currency: ${dto.currency}`);
    this.logger.log(`amount: ${dto.amount}`);
    this.logger.log(`paymentMethod: ${dto.paymentMethod || 'default'}`);
    this.logger.log(`provider: ${dto.provider || 'default'}`);
    try {
      const result = await this.depositsService.createDeposit(request.user.userId, dto);
      this.logger.log('=== CREATE DEPOSIT SUCCESS ===');
      return result;
    } catch (error) {
      this.logger.error('=== CREATE DEPOSIT FAILED ===');
      this.logger.error(`Exception: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error) {
        this.logger.error(`Stack: ${error.stack}`);
      }
      throw error;
    }
  }

  @Get()
  async listDeposits(@Req() request: { user: { userId: string } }, @Query('status') status?: string, @Query('currency') currency?: string, @Query('provider') provider?: string) {
    return this.depositsService.listDeposits(request.user.userId, { status, currency, provider });
  }

  @Get(':id')
  async getDeposit(@Req() request: { user: { userId: string } }, @Param('id') id: string) {
    return this.depositsService.getDeposit(request.user.userId, id);
  }

  @Post(':id/verify')
  async verifyDeposit(@Req() request: { user: { userId: string } }, @Param('id') id: string) {
    const deposit = await this.depositsService.getDeposit(request.user.userId, id);
    return this.depositsService.verifyAndCreditDeposit({
      provider: deposit.provider,
      providerTransactionId: deposit.providerTransactionId ?? '',
      providerReference: deposit.providerReference ?? undefined,
      amount: deposit.amount.toString(),
      currency: deposit.currencyCode,
    });
  }

  @Post('__test/ghs-diagnostic')
  @Public()
  async testGhsDiagnostic(@Body() dto: CreateDepositDto) {
    // Test endpoint to run GHS deposit without auth for diagnostic logging
    // This endpoint is UNSAFE - should only exist during debugging
    const testUserId = dto['userId'] || 'test-diagnostic-user';
    this.logger.log('[TEST ENDPOINT] GHS Diagnostic - userId=' + testUserId);
    try {
      const result = await this.depositsService.createDeposit(testUserId, dto);
      return result;
    } catch (error) {
      this.logger.error('[TEST ENDPOINT] Error: ' + (error instanceof Error ? error.message : String(error)));
      throw error;
    }
  }
}
