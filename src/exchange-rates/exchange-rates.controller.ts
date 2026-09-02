import { Controller, Get, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';

@Controller('exchange-rates')
export class ExchangeRatesController {
  private readonly logger = new Logger(ExchangeRatesController.name);

  constructor(private readonly service: ExchangeRatesService) {}

  @Get()
  async get() {
    try {
      return await this.service.getRates();
    } catch (error) {
      this.logger.error(`exchange-rates fetch failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServiceUnavailableException('Exchange rates are temporarily unavailable.');
    }
  }
}
