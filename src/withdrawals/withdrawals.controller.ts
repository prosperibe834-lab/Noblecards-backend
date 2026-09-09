import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateWithdrawalQuoteDto } from './withdrawals.dto';
import { WithdrawalQuoteService } from './withdrawal-quote.service';

@Controller('withdrawals/quotes')
@UseGuards(AuthGuard)
export class WithdrawalsController {
  constructor(private readonly quotes: WithdrawalQuoteService) {}

  @Post()
  create(@Req() request: { user: { userId: string } }, @Body() dto: CreateWithdrawalQuoteDto) {
    return this.quotes.createQuote(request.user.userId, dto);
  }

  @Get(':id')
  get(@Req() request: { user: { userId: string } }, @Param('id') id: string) {
    return this.quotes.getQuoteForUser(request.user.userId, id);
  }
}