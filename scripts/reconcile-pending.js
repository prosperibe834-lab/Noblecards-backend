const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { WithdrawalPayoutService } = require('../dist/withdrawals/withdrawal-payout.service');

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const payoutService = app.get(WithdrawalPayoutService);
  const userId = 'fd7d5527-e0c4-4f9a-8a35-f9077838c7c1';
  
  for (const withdrawalId of [
    '55113c2e-550c-4c50-b7dd-f1185feb10ad',
    'd20b6743-2ba0-41c6-a09c-2f7c2fc3b924',
    'da5ae143-7884-427a-acbd-f4ad96bb5e0b'
  ]) {
    try {
      const result = await payoutService.reconcile(userId, withdrawalId);
      console.log(`Reconciled ${withdrawalId}:`, result);
    } catch (e) {
      console.error(`Error reconciling ${withdrawalId}:`, e.message);
    }
  }
  await app.close();
}

main().catch(console.error);
