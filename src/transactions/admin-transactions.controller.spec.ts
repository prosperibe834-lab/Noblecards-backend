import { GUARDS_METADATA } from '@nestjs/common/constants';
import { AuthGuard } from '../auth/auth.guard';
import { AdminDashboardGuard } from '../dashboard/admin-dashboard.guard';
import { AdminTransactionsController } from './admin-transactions.controller';

describe('AdminTransactionsController authorization', () => {
  it('requires an authenticated admin for the transaction endpoint', () => {
    expect(
      Reflect.getMetadata(GUARDS_METADATA, AdminTransactionsController),
    ).toEqual([AuthGuard, AdminDashboardGuard]);
  });
});
