import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'node:crypto';

@Injectable()
export class BeneficiaryEncryptionService {
  constructor(private readonly config: ConfigService) {}

  private getSecret(name: string): string {
    const value = this.config.get<string>(name);
    if (!value) {
      throw new Error(`${name} is not configured.`);
    }

    return value;
  }

  private getAesKey(name: string): Buffer {
    const secret = this.getSecret(name);
    return createHash('sha256').update(secret, 'utf8').digest();
  }

  normalizeIdentifier(value: unknown): string {
    const raw = String(value ?? '').trim();
    if (!raw) return '';

    return raw
      .replace(/[\s\-_/]+/g, '')
      .replace(/\+/g, '')
      .replace(/\u00A0/g, '');
  }

  maskIdentifier(value: unknown): string {
    const normalized = this.normalizeIdentifier(value);
    if (!normalized) return '******';

    if (normalized.length <= 4) {
      return '*'.repeat(Math.max(3, normalized.length));
    }

    const visible = normalized.slice(-4);
    const hiddenLength = Math.max(4, normalized.length - 4);
    return `${'*'.repeat(hiddenLength)}${visible}`;
  }

  encrypt<T>(payload: T): string {
    const key = this.getAesKey('NOBLECARDS_BENEFICIARY_ENCRYPTION_KEY');
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const plainText = JSON.stringify(payload);
    const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${ciphertext.toString('base64')}`;
  }

  decrypt<T>(payload: string): T {
    if (!payload || !payload.startsWith('v1:')) {
      throw new Error('Beneficiary payload is not in a supported encrypted format.');
    }

    const [version, ivBase64, tagBase64, ciphertextBase64] = payload.split(':');
    if (!version || !ivBase64 || !tagBase64 || !ciphertextBase64) {
      throw new Error('Beneficiary payload is malformed.');
    }

    const key = this.getAesKey('NOBLECARDS_BENEFICIARY_ENCRYPTION_KEY');
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    const ciphertext = Buffer.from(ciphertextBase64, 'base64');
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const plainText = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8');

    try {
      return JSON.parse(plainText) as T;
    } catch {
      throw new Error('Beneficiary payload could not be decrypted and parsed.');
    }
  }

  buildFingerprint(input: Record<string, unknown>): string {
    const secret = this.getSecret('NOBLECARDS_BENEFICIARY_FINGERPRINT_KEY');
    const canonical = JSON.stringify({
      countryCode: String(input.countryCode ?? '').toUpperCase(),
      currencyCode: String(input.currencyCode ?? '').toUpperCase(),
      method: String(input.method ?? ''),
      institutionCode: String(input.institutionCode ?? ''),
      accountNumber: this.normalizeIdentifier(input.accountNumber),
      routingNumber: this.normalizeIdentifier(input.routingNumber),
      sortCode: this.normalizeIdentifier(input.sortCode),
      mobileMoneyNumber: this.normalizeIdentifier(input.mobileMoneyNumber),
    });

    return createHmac('sha256', secret).update(canonical).digest('hex');
  }

  getLast4(value: unknown): string | null {
    const normalized = this.normalizeIdentifier(value);
    if (!normalized) return null;
    return normalized.slice(-4);
  }
}
