import { BadRequestException, Body, Controller, Get, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCardDepositDto, CreateDepositDto } from './deposits.dto';
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

  @Post('card')
  async createCardDeposit(@Req() request: { user: { userId: string } }, @Body() dto: CreateCardDepositDto) {
    return this.depositsService.createCardDeposit(request.user.userId, dto);
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
    let deposit = await this.depositsService.getDeposit(request.user.userId, id);
    if (deposit.status !== 'SUCCESSFUL') {
      await this.depositsService.reconcileDeposit(deposit);
      deposit = await this.depositsService.getDeposit(request.user.userId, id);
    }
    return {
      id: deposit.id,
      status: deposit.status,
      provider: deposit.provider,
      currency: deposit.currencyCode,
      amount: deposit.amount.toString(),
      fee: deposit.fee ? deposit.fee.toString() : '0.00',
      netAmount: deposit.netAmount ? deposit.netAmount.toString() : '0.00',
      walletId: deposit.walletId,
      providerReference: deposit.providerReference,
      providerTransactionId: deposit.providerTransactionId,
      transaction: deposit.transaction
        ? {
            id: deposit.transaction.id,
            status: deposit.transaction.status,
            reference: deposit.transaction.reference,
          }
        : null,
    };
  }

  @Post(':id/validate-otp')
  async validateOtp(
    @Req() request: { user: { userId: string } },
    @Param('id') id: string,
    @Body() body: { otp: string },
  ) {
    if (!body?.otp) {
      throw new BadRequestException('OTP is required.');
    }
    const deposit = await this.depositsService.validateDepositOtp(request.user.userId, id, body.otp);
    return {
      id: deposit.id,
      status: deposit.status,
      provider: deposit.provider,
      currency: deposit.currencyCode,
      amount: deposit.amount.toString(),
      fee: deposit.fee ? deposit.fee.toString() : '0.00',
      netAmount: deposit.netAmount ? deposit.netAmount.toString() : '0.00',
      walletId: deposit.walletId,
      providerReference: deposit.providerReference,
      providerTransactionId: deposit.providerTransactionId,
      transaction: deposit.transaction
        ? {
            id: deposit.transaction.id,
            status: deposit.transaction.status,
            reference: deposit.transaction.reference,
          }
        : null,
    };
  }
}

