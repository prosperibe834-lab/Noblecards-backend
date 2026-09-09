import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/public.decorator';
import { CreateWithdrawalDto } from './withdrawals.dto';
import { CreateBeneficiaryDto, ResolveBeneficiaryAccountDto } from './beneficiary.dto';
import { BeneficiaryService } from './beneficiary.service';
import { PaymentMethod } from '../generated/prisma';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalPayoutService } from './withdrawal-payout.service';

@Controller('withdrawals')
@UseGuards(AuthGuard)
export class WithdrawalPayoutController {
  constructor(
    private readonly payouts: WithdrawalPayoutService,
    private readonly withdrawals: WithdrawalService,
    private readonly beneficiaries: BeneficiaryService,
  ) {}

  @Post()
  create(@Req() request: { user: { userId: string } }, @Body() dto: CreateWithdrawalDto) {
    return this.withdrawals.createWithdrawal(request.user.userId, dto);
  }

  @Get('banks')
  banks(@Req() request: { user: { userId: string } }, @Query('countryCode') countryCode = 'NG', @Query('currencyCode') currencyCode = 'NGN') {
    return this.beneficiaries.getBanksForUser(request.user.userId, countryCode, currencyCode).then((banks) => ({ banks }));
  }

  @Post('beneficiaries/verify')
  verifyBeneficiary(@Req() request: { user: { userId: string } }, @Body() dto: ResolveBeneficiaryAccountDto) {
    return this.beneficiaries.resolveAccountForUser(request.user.userId, { ...dto, method: PaymentMethod.BANK_TRANSFER });
  }

  @Post('beneficiaries')
  createBeneficiary(@Req() request: { user: { userId: string } }, @Body() dto: CreateBeneficiaryDto) {
    return this.beneficiaries.createBeneficiary(request.user.userId, dto);
  }

  @Post(':withdrawalId/execute')
  execute(@Req() request: { user: { userId: string } }, @Param('withdrawalId') withdrawalId: string) {
    return this.payouts.execute(request.user.userId, withdrawalId);
  }

  @Post(':withdrawalId/reconcile')
  reconcile(@Req() request: { user: { userId: string } }, @Param('withdrawalId') withdrawalId: string) {
    return this.payouts.reconcile(request.user.userId, withdrawalId);
  }

  @Public()
  @Post('webhooks/flutterwave')
  webhook(@Headers('verif-hash') signature: string | undefined, @Req() request: { rawBody?: Buffer }) {
    const rawBody = request.rawBody?.toString('utf8');
    if (!rawBody) throw new BadRequestException('PAYOUT_WEBHOOK_RAW_BODY_MISSING: Raw webhook body is required.');
    return this.payouts.handleWebhook(signature, rawBody);
  }
}
