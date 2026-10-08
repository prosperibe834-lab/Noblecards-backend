import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly smtpPassword = process.env.SMTP_PASS?.replace(/\s+/g, '');
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER && this.smtpPassword
      ? { user: process.env.SMTP_USER, pass: this.smtpPassword }
      : undefined,
  });

  async sendVerificationCode(email: string, code: string): Promise<void> {
    await this.send(email, 'Verify your NobleCards account', `
      <h2>Verify your NobleCards account</h2>
      <p>Thank you for creating your NobleCards account.</p>
      <p>Your verification code is:</p>
      <h1 style="font-size: 32px; letter-spacing: 8px;">${code}</h1>
      <p>Enter this 6-digit code in the NobleCards app to verify your email address.</p>
      <p>This code will expire shortly.</p>
      <p>If you did not create a NobleCards account, you can safely ignore this email.</p>
    `);
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    await this.send(email, 'Reset your NobleCards password', `
      <h2>Reset your NobleCards password</h2>
      <p>Your password reset code is:</p>
      <h1 style="font-size: 32px; letter-spacing: 8px;">${code}</h1>
      <p>This code will expire shortly. If you did not request this, you can safely ignore this email.</p>
    `);
  }

  async sendTransactionPinResetCode(email: string, code: string): Promise<void> {
    await this.send(email, 'Reset your NobleCards transaction PIN', `
      <h2>Reset your NobleCards transaction PIN</h2>
      <p>Your transaction PIN reset code is:</p>
      <h1 style="font-size: 32px; letter-spacing: 8px;">${code}</h1>
      <p>Enter this code in the NobleCards app to verify your identity before changing your transaction PIN.</p>
      <p>This code will expire shortly. If you did not request this, you can safely ignore this email.</p>
    `);
  }

  async sendWithdrawalCreatedEmail(email: string, reference: string, amount: string, currency: string): Promise<void> {
    await this.send(email, 'Your NobleCards withdrawal is processing', `
      <h2>Withdrawal request received</h2>
      <p>Your NobleCards withdrawal request has been received and is being processed.</p>
      <p><strong>Amount:</strong> ${amount} ${currency}</p>
      <p><strong>Reference:</strong> ${reference}</p>
      <p>We will send another update when the transfer status changes.</p>
    `);
  }

  async sendWithdrawalSuccessEmail(email: string, details: {
    sourceAmount: string;
    sourceCurrency: string;
    destinationAmount: string;
    destinationCurrency: string;
    destination: string;
    reference: string;
    completedAt: Date;
  }): Promise<void> {
    await this.send(email, 'Your NobleCards withdrawal was successful', `
      <h2>Withdrawal successful</h2>
      <p>Your NobleCards withdrawal has been completed successfully.</p>
      <p><strong>Amount sent:</strong> ${details.sourceAmount} ${details.sourceCurrency}</p>
      <p><strong>Amount delivered:</strong> ${details.destinationAmount} ${details.destinationCurrency}</p>
      <p><strong>Destination:</strong> ${details.destination}</p>
      <p><strong>Reference:</strong> ${details.reference}</p>
      <p><strong>Completed:</strong> ${details.completedAt.toISOString()}</p>
      <p>Thank you for using NobleCards.</p>
    `);
  }

  async sendGiftCardPurchaseSuccessEmail(email: string, details: {
    firstName: string | null;
    brand: string;
    amount: string;
    currency: string;
    reference: string;
    purchasedAt: Date;
  }): Promise<void> {
    const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const firstName = escape(details.firstName?.trim() || 'there');
    await this.send(email, 'Your NobleCards Gift Card Purchase Was Successful', `
      <div style="font-family:Arial,sans-serif;color:#202124;max-width:600px;margin:0 auto;line-height:1.6">
        <h1 style="color:#18794e">NobleCards</h1>
        <p>Hello ${firstName},</p>
        <p>Your gift card purchase was successfully completed.</p>
        <p><strong>Gift Card:</strong> ${escape(details.brand)}</p>
        <p><strong>Amount:</strong> ${escape(details.amount)} ${escape(details.currency)}</p>
        <p><strong>Order ID:</strong> ${escape(details.reference)}</p>
        <p><strong>Date:</strong> ${escape(details.purchasedAt.toISOString())}</p>
        <p><strong>Status:</strong> Completed</p>
        <p>Your gift card is ready to view securely in NobleCards. Open the app and select your purchase to view it.</p>
        <p>Thank you for using NobleCards.</p>
        <p>NobleCards Team</p>
      </div>
    `);
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !this.smtpPassword) {
      throw new ServiceUnavailableException('Email delivery is not configured.');
    }
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
        to,
        subject,
        html,
      });
    } catch {
      throw new ServiceUnavailableException('Unable to send email right now.');
    }
  }
}