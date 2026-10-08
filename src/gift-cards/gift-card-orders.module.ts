import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GiftCardOrdersController } from './gift-card-orders.controller';

@Module({
  imports: [AuthModule],
  controllers: [GiftCardOrdersController],
})
export class GiftCardOrdersModule {}