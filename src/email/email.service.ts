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

  async sendDepositSuccessEmail(email: string, details: {
    firstName: string | null;
    amount: string;
    currency: string;
    walletCreditAmount: string;
    reference: string;
    completedAt: Date;
  }): Promise<void> {
    const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const firstName = escape(details.firstName?.trim() || 'there');
    await this.send(email, 'Your NobleCards Deposit Was Successful', `
      <div style="font-family:Arial,sans-serif;color:#202124;max-width:600px;margin:0 auto;line-height:1.6">
        <h1 style="color:#18794e">NobleCards</h1>
        <p>Hello ${firstName},</p>
        <p>Your deposit has been completed successfully and your wallet has been credited.</p>
        <p><strong>Amount Paid:</strong> ${escape(details.amount)} ${escape(details.currency)}</p>
        <p><strong>Wallet Credited:</strong> $${escape(details.walletCreditAmount)} USD</p>
        <p><strong>Reference:</strong> ${escape(details.reference)}</p>
        <p><strong>Completed:</strong> ${escape(details.completedAt.toISOString())}</p>
        <p><strong>Status:</strong> Successful</p>
        <p>Thank you for choosing NobleCards.</p>
      </div>
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

  async sendBroadcastEmail(email: string, title: string, message: string, firstName?: string | null): Promise<void> {
    const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const name = firstName?.trim() ? escape(firstName) : 'there';
    await this.send(email, title, `
      <div style="font-family: Arial, sans-serif; color: #202124; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="border-bottom: 2px solid #00D084; padding-bottom: 12px; margin-bottom: 18px;">
          <h1 style="color: #0F172A; margin: 0; font-size: 24px;">NobleCards</h1>
        </div>
        <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">${escape(title)}</h2>
        <p>Hello ${name},</p>
        <div style="color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-line; background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #00D084; margin: 16px 0;">
          ${escape(message)}
        </div>
        <p style="color: #64748b; font-size: 13px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          You received this message because you have a NobleCards account. If you need any assistance, reach out to our 24/7 support.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          &copy; ${new Date().getFullYear()} NobleCards. All rights reserved.
        </p>
      </div>
    `);
  }

  async sendHappyNewMonthEmail(email: string, details: {
    firstName?: string | null;
    country?: string | null;
    monthName: string;
    year: number;
  }): Promise<void> {
    const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const name = details.firstName?.trim() ? escape(details.firstName) : 'Valued Trader';
    const country = details.country?.trim() ? escape(details.country) : null;
    const month = escape(details.monthName);
    const subject = `✨ Happy New Month, ${name}! Wishing You a Prosperous ${month}`;

    await this.send(email, subject, `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #00D084;">
          <h1 style="color: #00D084; margin: 0 0 8px; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">NobleCards</h1>
          <p style="color: #94a3b8; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px;">Premier Digital Asset & Gift Card Exchange</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <div style="display: inline-block; background: rgba(0, 208, 132, 0.12); color: #059669; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.5px;">
            🎉 Happy New Month
          </div>
          
          <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin: 0 0 16px;">
            Welcome to ${month}! A New Month of Success & Prosperity
          </h2>
          
          <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">
            Hello <strong>${name}</strong>,
          </p>
          
          <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">
            As the calendar turns to <strong>${month}</strong>${country ? ` in ${country}` : ''}, the entire team at NobleCards wishes you overflowing success, breakthroughs, and financial growth in everything you do.
          </p>

          <p style="font-size: 15px; color: #334155; margin-bottom: 20px;">
            Thank you for trusting NobleCards as your go-to financial partner. We are committed to making your transactions seamless, fast, and highly profitable every single day.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px; color: #0f172a; font-size: 16px; font-weight: 600;">
              ✨ Why Keep Trading with NobleCards This Month?
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
              <li><strong>Highest Market Rates:</strong> Maximum payout value for Apple, Steam, Razer Gold, Sephora, Nordstrom, and all major gift cards.</li>
              <li><strong>Instant Wallet Funding & Swaps:</strong> Lightning-fast processing with zero hidden fees.</li>
              <li><strong>Bank-Grade Protection:</strong> Top-tier security ensuring your wallet, funds, and trades remain bulletproof.</li>
              <li><strong>24/7 Dedicated Support:</strong> Real humans ready to assist you any minute of the day.</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 32px 0 24px;">
            <a href="https://noblecards.com" style="background: #00D084; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 14px rgba(0, 208, 132, 0.4);">
              Open NobleCards & Start Trading
            </a>
          </div>

          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            Set your financial goals high this month. Log in today to check today's boosted rates and earn loyalty rewards on your trades!
          </p>
          
          <p style="font-size: 14px; color: #334155; margin-top: 20px;">
            Wishing you a fruitful and prosperous month ahead!<br/>
            <strong>The NobleCards Executive Team</strong>
          </p>
        </div>

        <div style="background: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0 0 6px;">
            You are receiving this official greeting as a registered member of NobleCards.
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            &copy; ${details.year} NobleCards. All rights reserved.
          </p>
        </div>
      </div>
    `);
  }

  async sendHappyBirthdayEmail(email: string, details: {
    firstName?: string | null;
  }): Promise<void> {
    const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const name = details.firstName?.trim() ? escape(details.firstName) : 'Valued User';
    const subject = `🎂 Happy Birthday, ${name}! A Special Celebration from NobleCards`;

    await this.send(email, subject, `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #00D084;">
          <h1 style="color: #00D084; margin: 0 0 8px; font-size: 26px; font-weight: 800;">NobleCards</h1>
          <p style="color: #94a3b8; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px;">Celebration Club</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <div style="font-size: 40px; text-align: center; margin-bottom: 12px;">🎂✨🎁</div>
          <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; text-align: center; margin: 0 0 16px;">
            Happy Birthday, ${name}!
          </h2>
          
          <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">
            Today is all about celebrating you! On behalf of the entire NobleCards family, we want to wish you a very happy birthday filled with joy, peace, and prosperous new beginnings.
          </p>

          <p style="font-size: 15px; color: #334155; margin-bottom: 20px;">
            We deeply appreciate having you with us. As a token of our celebration, we have unlocked a special <strong>VIP Birthday Bonus Boost</strong> on your NobleCards account today.
          </p>

          <div style="background: rgba(0, 208, 132, 0.08); border: 1px dashed #00D084; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #065f46; font-size: 13px; text-transform: uppercase; font-weight: 700; margin: 0 0 6px;">Your Birthday Gift</p>
            <h3 style="color: #059669; font-size: 24px; font-weight: 800; margin: 0 0 8px;">VIP Rate Boost + Bonus Voucher</h3>
            <p style="color: #475569; font-size: 13px; margin: 0;">Log in today to automatically enjoy enhanced trade margins on all transactions.</p>
          </div>

          <div style="text-align: center; margin: 28px 0 20px;">
            <a href="https://noblecards.com" style="background: #00D084; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; display: inline-block;">
              Claim Your Birthday Perks
            </a>
          </div>

          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            Thank you for making NobleCards your digital exchange of choice. Have an unforgettable birthday celebration!
          </p>
          
          <p style="font-size: 14px; color: #334155; margin-top: 16px;">
            Warmest wishes,<br/>
            <strong>Your Friends at NobleCards</strong>
          </p>
        </div>
      </div>
    `);
  }

  async sendNewLoginAlertEmail(email: string, details: {
    firstName?: string | null;
    ipAddress: string;
    userAgent: string;
    location: string;
    timestamp: Date;
  }): Promise<void> {
    const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const name = details.firstName?.trim() ? escape(details.firstName) : 'there';
    const ip = escape(details.ipAddress);
    const ua = escape(details.userAgent);
    const loc = escape(details.location);
    const timeStr = details.timestamp.toUTCString();

    const subject = `🔐 Security Alert: New Login Detected on Your NobleCards Account`;

    await this.send(email, subject, `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
        <div style="background: #0F172A; padding: 24px; text-align: center; border-bottom: 3px solid #EF4444;">
          <h1 style="color: #ffffff; margin: 0 0 6px; font-size: 24px;">NobleCards Security</h1>
          <p style="color: #94a3b8; margin: 0; font-size: 13px;">Automated Account Defense System</p>
        </div>
        
        <div style="padding: 28px 24px;">
          <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #EF4444; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #991B1B; font-weight: 600; font-size: 14px;">
              ⚠️ New device or unrecognized IP address detected
            </p>
          </div>

          <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">
            Hello <strong>${name}</strong>,
          </p>

          <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">
            We noticed a new sign-in to your NobleCards account from a different device or network address. Please review the activity details below:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <tr>
              <td style="padding: 12px 16px; font-size: 14px; color: #64748b; font-weight: 600; width: 35%; border-bottom: 1px solid #e2e8f0;">IP Address:</td>
              <td style="padding: 12px 16px; font-size: 14px; color: #0f172a; font-family: monospace; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${ip}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-size: 14px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Location:</td>
              <td style="padding: 12px 16px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${loc}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-size: 14px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Device / Client:</td>
              <td style="padding: 12px 16px; font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${ua}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-size: 14px; color: #64748b; font-weight: 600;">Timestamp:</td>
              <td style="padding: 12px 16px; font-size: 14px; color: #0f172a;">${timeStr}</td>
            </tr>
          </table>

          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #0f172a; font-weight: 600;">Was this you?</p>
            <p style="margin: 0; font-size: 13px; color: #475569;">
              If you recently signed in, you can safely disregard this message. Your session is active and secure.
            </p>
          </div>

          <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #9f1239; font-weight: 600;">Don't recognize this activity?</p>
            <p style="margin: 0 0 12px; font-size: 13px; color: #881337;">
              Your login credentials might be compromised. Please protect your funds immediately:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #881337;">
              <li>Change your account password right away.</li>
              <li>Reset your 4-digit transaction PIN.</li>
              <li>Contact NobleCards Security at support@noblecards.com.</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 24px 0 16px;">
            <a href="https://noblecards.com" style="background: #EF4444; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; display: inline-block;">
              Secure My Account
            </a>
          </div>

          <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 20px;">
            NobleCards Security Operations &bull; Automated Alert
          </p>
        </div>
      </div>
    `);
  }

  async sendWeMissYouEmail(email: string, details: {
    firstName?: string | null;
  }): Promise<void> {
    const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const name = details.firstName?.trim() ? escape(details.firstName) : 'there';
    const subject = `We Miss You at NobleCards! Here's a Special Welcome-Back Treat ✨`;

    await this.send(email, subject, `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #00D084;">
          <h1 style="color: #00D084; margin: 0 0 8px; font-size: 26px; font-weight: 800;">NobleCards</h1>
          <p style="color: #94a3b8; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px;">Welcome Back Community</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin: 0 0 16px;">
            It's Been a While, ${name}! We Miss You ✨
          </h2>
          
          <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">
            We noticed you haven't traded or logged in for some time, and the NobleCards community just hasn't felt the same without you!
          </p>

          <p style="font-size: 15px; color: #334155; margin-bottom: 20px;">
            While you've been away, we've rolled out powerful updates to supercharge your trading experience:
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.8;">
              <li><strong>Enhanced Exchange Rates:</strong> Even higher daily rates on Steam, Apple, Razer Gold, and Sephora.</li>
              <li><strong>Sub-Minute Settlements:</strong> Fastest withdrawal confirmations directly to your local bank account.</li>
              <li><strong>New Reward Tiers:</strong> Earn cashback credits on every single transaction.</li>
            </ul>
          </div>

          <div style="background: rgba(0, 208, 132, 0.08); border: 1px dashed #00D084; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #065f46; font-size: 13px; text-transform: uppercase; font-weight: 700; margin: 0 0 4px;">Exclusive Returning Bonus</p>
            <h3 style="color: #059669; font-size: 22px; font-weight: 800; margin: 0 0 8px;">Claim Your Returning Perk</h3>
            <p style="color: #475569; font-size: 13px; margin: 0;">Log back into your account today to redeem special returning rewards on your next trade.</p>
          </div>

          <div style="text-align: center; margin: 28px 0 20px;">
            <a href="https://noblecards.com" style="background: #00D084; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; display: inline-block;">
              Log In & Claim My Reward
            </a>
          </div>

          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            If you ever need any assistance or have questions, our team is always here for you 24/7.
          </p>
          
          <p style="font-size: 14px; color: #334155; margin-top: 16px;">
            Warm regards,<br/>
            <strong>The NobleCards Team</strong>
          </p>
        </div>
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