import { Controller, Headers, Logger, Post, Req } from '@nestjs/common';
import { FlutterwaveService } from './flutterwave.service';

@Controller('flutterwave')
export class FlutterwaveController {
  private readonly logger = new Logger(FlutterwaveController.name);

  constructor(private readonly flutterwave: FlutterwaveService) {}

  @Post('webhook')
  async webhook(
    @Headers('verif-hash') signature: string | undefined,
    @Req() request: { rawBody?: Buffer; body?: unknown },
  ) {
    const raw = request.rawBody && request.rawBody.length > 0
      ? request.rawBody.toString('utf8')
      : Buffer.isBuffer(request.body)
        ? request.body.toString('utf8')
        : typeof request.body === 'string'
          ? request.body
          : JSON.stringify(request.body ?? {});

    this.logger.log('Flutterwave webhook received.');

    let payload: Record<string, any> = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = (request.body as Record<string, any>) ?? {};
    }

    const isValid = await this.flutterwave.validateWebhookSignature(signature, raw);
    if (!isValid) {
      this.logger.warn('Invalid Flutterwave webhook signature received.');
      return {
        ok: false,
        message: 'Invalid Flutterwave webhook signature.',
      };
    }

    const processed = await this.flutterwave.processWebhookEvent(payload);
    if (!processed.ok) {
      this.logger.warn(`Flutterwave webhook processed without a matching deposit: ${processed.message ?? 'Unknown reason'}`);
    }

    return {
      ok: processed.ok,
      processed: processed.processed ?? false,
      event: payload?.event ?? 'unknown',
      message: processed.message ?? 'Webhook received and processed by the backend.',
      depositId: processed.depositId ?? null,
    };
  }
}
