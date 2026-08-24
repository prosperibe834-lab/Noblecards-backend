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