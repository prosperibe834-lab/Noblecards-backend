jest.mock('../auth/auth.guard', () => ({ AuthGuard: class AuthGuard {} }));

import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { AppModule } from '../app.module';
import { AuthGuard } from '../auth/auth.guard';
import { WithdrawalsModule } from './withdrawals.module';
import { WithdrawalPayoutController } from './withdrawal-payout.controller';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalPayoutService } from './withdrawal-payout.service';
import { BeneficiaryService } from './beneficiary.service';

describe('WithdrawalPayoutController', () => {
  it('registers the authenticated GET /withdrawals route in AppModule', async () => {
    const handler = Object.getOwnPropertyDescriptor(
      WithdrawalPayoutController.prototype,
      'list',
    )?.value;
    const listWithdrawals = jest.fn().mockResolvedValue([]);
    const withdrawals = {
      listWithdrawals,
    } as unknown as WithdrawalService;
    const controller = new WithdrawalPayoutController(
      {} as WithdrawalPayoutService,
      withdrawals,
    );

    expect(Reflect.getMetadata('imports', AppModule)).toContain(WithdrawalsModule);
    expect(Reflect.getMetadata(PATH_METADATA, WithdrawalPayoutController)).toBe(
      'withdrawals',
    );
    expect(Reflect.getMetadata(METHOD_METADATA, handler)).toBe(RequestMethod.GET);
    expect(
      Reflect.getMetadata(GUARDS_METADATA, WithdrawalPayoutController),
    ).toContain(AuthGuard);
    await expect(
      controller.list({ user: { userId: 'user-1' } }),
    ).resolves.toEqual([]);
    expect(listWithdrawals).toHaveBeenCalledWith('user-1', {
      status: undefined,
      currency: undefined,
      country: undefined,
      provider: undefined,
    });
  });

  it('delegates POST /withdrawals using the authenticated user ID and DTO', async () => {
    const result = { id: 'withdrawal-1', status: 'PENDING' };
    const withdrawals = {
      createWithdrawal: jest.fn().mockResolvedValue(result),
    } as unknown as WithdrawalService;
    const controller = new WithdrawalPayoutController(
      {} as WithdrawalPayoutService,
      withdrawals,
    );
    const dto = {
      quoteId: 'quote-1',
      beneficiaryId: 'beneficiary-1',
      idempotencyKey: 'wd-1',
      pin: '1234',
    };

    await expect(controller.create({ user: { userId: 'user-1' } }, dto)).resolves.toBe(result);
    expect(withdrawals.createWithdrawal).toHaveBeenCalledWith('user-1', dto);
  });

  it('delegates bank lookup, verification, and beneficiary creation for the authenticated user', async () => {
    const beneficiaries = {
      getBanksForUser: jest.fn().mockResolvedValue([{ code: '044', name: 'Access Bank' }]),
      resolveAccountForUser: jest.fn().mockResolvedValue({ verificationStatus: 'VERIFIED', accountHolderName: 'Test User' }),
      createBeneficiary: jest.fn().mockResolvedValue({ id: 'beneficiary-1', verificationStatus: 'VERIFIED' }),
    } as unknown as BeneficiaryService;
    const controller = new WithdrawalPayoutController(
      {} as WithdrawalPayoutService,
      {} as WithdrawalService,
      beneficiaries,
    );

    await expect(controller.banks({ user: { userId: 'user-1' } }, 'NG', 'NGN')).resolves.toEqual({ banks: [{ code: '044', name: 'Access Bank' }] });
    await expect(controller.verifyBeneficiary({ user: { userId: 'user-1' } }, { countryCode: 'NG', currencyCode: 'NGN', method: 'BANK_TRANSFER' } as any)).resolves.toEqual(expect.objectContaining({ verificationStatus: 'VERIFIED' }));
    await expect(controller.createBeneficiary({ user: { userId: 'user-1' } }, { countryCode: 'NG', currencyCode: 'NGN', method: 'BANK_TRANSFER', type: 'BANK_ACCOUNT' } as any)).resolves.toEqual(expect.objectContaining({ id: 'beneficiary-1' }));
    expect(beneficiaries.getBanksForUser).toHaveBeenCalledWith('user-1', 'NG', 'NGN');
    expect(beneficiaries.resolveAccountForUser).toHaveBeenCalledWith('user-1', expect.objectContaining({ method: 'BANK_TRANSFER' }));
    expect(beneficiaries.createBeneficiary).toHaveBeenCalledWith('user-1', expect.anything());
  });
});
