import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomInt, createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import {
  EmailCodeDto,
  EmailDto,
  LoginDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = this.normalizeEmail(dto.email);
    const existing = await this.users.findByEmail(email);
    if (existing)
      throw new ConflictException('An account with this email already exists.');
    const requestedReferralCode =
      dto.referralCode?.trim().toUpperCase() || null;
    const existingPending = await this.prisma.pendingRegistration.findUnique({
      where: { email },
    });
    if (
      existingPending?.referralCode &&
      requestedReferralCode &&
      existingPending.referralCode !== requestedReferralCode
    ) {
      throw new ConflictException(
        'A referral code is already attached to this pending registration.',
      );
    }
    const referralCode =
      requestedReferralCode ?? existingPending?.referralCode ?? null;
    if (referralCode) {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode },
        select: { id: true, email: true },
      });
      if (!referrer)
        throw new BadRequestException('The referral code is invalid.');
      if (this.normalizeEmail(referrer.email) === email) {
        throw new BadRequestException('You cannot use your own referral code.');
      }
    }
    const code = this.newCode();
    const pending = await this.prisma.pendingRegistration.upsert({
      where: { email },
      update: {
        ...this.registrationData(dto, await bcrypt.hash(dto.password, 12)),
        referralCode,
        otpHash: this.hash(code),
        otpExpiresAt: this.otpExpiry(),
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
      },
      create: {
        email,
        ...this.registrationData(dto, await bcrypt.hash(dto.password, 12)),
        referralCode,
        otpHash: this.hash(code),
        otpExpiresAt: this.otpExpiry(),
        lastOtpSentAt: new Date(),
      },
    });
    await this.email.sendVerificationCode(email, code);
    return { requiresVerification: true, email: pending.email };
  }

  async verifyEmail(dto: EmailCodeDto) {
    const pending = await this.prisma.pendingRegistration.findUnique({
      where: { email: this.normalizeEmail(dto.email) },
    });
    if (!pending)
      throw new BadRequestException('No pending registration was found.');
    await this.checkCode(
      pending.otpHash,
      dto.code,
      pending.otpExpiresAt,
      pending.otpAttempts,
      async (attempts) =>
        this.prisma.pendingRegistration.update({
          where: { id: pending.id },
          data: { otpAttempts: attempts },
        }),
    );
    let user: any;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        user = await this.prisma.$transaction(async (transaction) => {
          if (pending.existingUserId) {
            const updated = await transaction.user.update({
              where: { id: pending.existingUserId },
              data: { isEmailVerified: true },
            });
            await transaction.pendingRegistration.delete({
              where: { id: pending.id },
            });
            return updated;
          }
          const created = await transaction.user.create({
            data: {
              email: pending.email,
              passwordHash: pending.passwordHash,
              firstName: pending.firstName,
              lastName: pending.lastName,
              phone: pending.phone,
              country: pending.country,
              countryCode: pending.countryCode,
              gender: pending.gender,
              referralCode: this.newReferralCode(),
              isEmailVerified: true,
            },
          });
          if (pending.referralCode) {
            const referrer = await transaction.user.findUnique({
              where: { referralCode: pending.referralCode },
              select: { id: true },
            });
            if (!referrer || referrer.id === created.id) {
              throw new BadRequestException('The referral code is invalid.');
            }
            await transaction.referralAttribution.create({
              data: {
                referrerId: referrer.id,
                referredUserId: created.id,
                referralCode: pending.referralCode,
              },
            });
          }
          await transaction.pendingRegistration.delete({
            where: { id: pending.id },
          });
          return created;
        });
        break;
      } catch (error) {
        const target = (error as { meta?: { target?: unknown } })?.meta?.target;
        const referralCodeCollision =
          (error as { code?: string })?.code === 'P2002' &&
          (Array.isArray(target)
            ? target.includes('referralCode')
            : target === 'User_referralCode_key');
        if (!referralCodeCollision || attempt === 4) throw error;
      }
    }
    return this.issueSession(await this.users.refreshVerification(user));
  }

  async resendOtp(dto: ResendOtpDto) {
    const email = this.normalizeEmail(dto.email);
    const pending = await this.prisma.pendingRegistration.findUnique({
      where: { email },
    });
    if (!pending) {
      const existing = await this.users.findByEmail(email);
      if (!existing || existing.isEmailVerified)
        throw new BadRequestException('No pending registration was found.');
      const code = this.newCode();
      const linkedPending = await this.prisma.pendingRegistration.create({
        data: {
          email,
          passwordHash: existing.passwordHash,
          firstName: existing.firstName,
          lastName: existing.lastName,
          phone: existing.phone,
          country: existing.country,
          countryCode: existing.countryCode,
          gender: existing.gender,
          existingUserId: existing.id,
          otpHash: this.hash(code),
          otpExpiresAt: this.otpExpiry(),
          lastOtpSentAt: new Date(),
        },
      });
      await this.email.sendVerificationCode(linkedPending.email, code);
      return { sent: true };
    }
    await this.enforceCooldown(pending.lastOtpSentAt);
    const code = this.newCode();
    await this.prisma.pendingRegistration.update({
      where: { id: pending.id },
      data: {
        otpHash: this.hash(code),
        otpExpiresAt: this.otpExpiry(),
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
      },
    });
    await this.email.sendVerificationCode(email, code);
    return { sent: true };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(this.normalizeEmail(dto.email));
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash)))
      throw new UnauthorizedException('Invalid email or password.');
    if (!user.isEmailVerified)
      throw new UnauthorizedException(
        'Please verify your email before signing in.',
      );
    if (!user.isActive)
      throw new UnauthorizedException('This account is inactive.');
    return this.issueSession(user);
  }

  async changePassword(
    userId: string,
    currentSessionId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    if (newPassword.length < 8) {
      throw new BadRequestException(
        'New password must be at least eight characters long.',
      );
    }
    const user = await this.users.findById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect.');
    }
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      this.prisma.refreshSession.updateMany({
        where: {
          userId,
          id: { not: currentSessionId },
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { updated: true };
  }

  async forgotPassword(dto: EmailDto) {
    const user = await this.users.findByEmail(this.normalizeEmail(dto.email));
    if (user) {
      const code = this.newCode();
      await this.prisma.passwordResetChallenge.deleteMany({
        where: { userId: user.id },
      });
      await this.prisma.passwordResetChallenge.create({
        data: {
          userId: user.id,
          codeHash: this.hash(code),
          expiresAt: this.otpExpiry(),
        },
      });
      await this.email.sendPasswordResetCode(user.email, code);
    }
    return { sent: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.users.findByEmail(this.normalizeEmail(dto.email));
    if (!user) throw new BadRequestException('Invalid or expired reset code.');
    const challenge = await this.prisma.passwordResetChallenge.findFirst({
      where: { userId: user.id, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (
      !challenge ||
      challenge.expiresAt <= new Date() ||
      this.hash(dto.code) !== challenge.codeHash
    )
      throw new BadRequestException('Invalid or expired reset code.');
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await bcrypt.hash(dto.newPassword, 12) },
      }),
      this.prisma.passwordResetChallenge.update({
        where: { id: challenge.id },
        data: { consumedAt: new Date() },
      }),
      this.prisma.refreshSession.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { reset: true };
  }

  async refresh(refreshToken: string) {
    const session = await this.prisma.refreshSession.findUnique({
      where: { tokenHash: this.hash(refreshToken) },
      include: { user: true },
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date())
      throw new UnauthorizedException('Invalid or expired refresh token.');
    await this.prisma.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
    return this.issueSession(session.user);
  }

  async logout(sessionId: string) {
    await this.prisma.refreshSession.updateMany({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
    return { loggedOut: true };
  }
  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException('User not found.');
    return { user: this.users.toPublicUser(user) };
  }

  private async issueSession(
    user: Parameters<UsersService['toPublicUser']>[0],
  ) {
    const refreshToken = randomBytes(48).toString('base64url');
    const session = await this.prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: this.hash(refreshToken),
        expiresAt: new Date(
          Date.now() +
            Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? 30) *
              86_400_000,
        ),
      },
    });
    const accessToken = await this.jwt.signAsync({
      userId: user.id,
      sessionId: session.id,
    });
    return { user: this.users.toPublicUser(user), accessToken, refreshToken };
  }

  private registrationData(dto: RegisterDto, passwordHash: string) {
    return {
      passwordHash,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      phone: dto.phone?.trim() || null,
      country: dto.country?.trim() || null,
      countryCode: dto.countryCode?.trim() || null,
      gender: dto.gender?.trim() || null,
    };
  }
  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }
  private newReferralCode() {
    return randomBytes(6).toString('hex').slice(0, 10).toUpperCase();
  }
  private newCode() {
    return randomInt(100000, 1_000_000).toString();
  }
  private hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }
  private otpExpiry() {
    return new Date(
      Date.now() + Number(process.env.OTP_EXPIRES_IN_MINUTES ?? 10) * 60_000,
    );
  }
  private async enforceCooldown(lastSentAt: Date | null) {
    if (
      lastSentAt &&
      Date.now() - lastSentAt.getTime() <
        Number(process.env.OTP_RESEND_COOLDOWN_SECONDS ?? 60) * 1000
    )
      throw new HttpException(
        'Please wait before requesting another code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
  }
  private async checkCode(
    hash: string,
    code: string,
    expiresAt: Date,
    attempts: number,
    increment: (attempts: number) => Promise<unknown>,
  ) {
    if (attempts >= 5)
      throw new HttpException(
        'Too many verification attempts.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    if (expiresAt <= new Date() || this.hash(code) !== hash) {
      await increment(attempts + 1);
      throw new BadRequestException('Invalid or expired verification code.');
    }
  }
}
