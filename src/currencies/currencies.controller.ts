import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrenciesService } from './currencies.service';

@Controller('currencies')
@UseGuards(AuthGuard)
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get()
  async list() {
    return this.service.listCurrencies();
  }

  @Get(':code')
  async get(@Param('code') code: string) {
    return this.service.getCurrency(code);
  }
}
