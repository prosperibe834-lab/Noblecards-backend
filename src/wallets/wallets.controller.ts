import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { WalletsService } from './wallets.service';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletsController {
  constructor(private readonly wallets: WalletsService) {}

  @Post()
  async createWallet(@Req() request: { user: { userId: string } }) {
    return this.wallets.getWallet(request.user.userId);
  }

  @Get()
  async getWallet(@Req() request: { user: { userId: string } }) {
    return this.wallets.getWallet(request.user.userId);
  }

  @Get('balances')
  async getBalances(@Req() request: { user: { userId: string } }) {
    return this.wallets.getBalances(request.user.userId);
  }
}
