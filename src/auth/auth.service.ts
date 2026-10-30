import {
  Logger,
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
  SecurityAuditEventInput,
  writeSecurityAuditEvent,
} from '../security-audit/security-audit.utils';
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminVerifyOtpDto,
  BiometricLoginDto,
  EmailCodeDto,
  EmailDto,
  LoginDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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

  async verifyEmail(
    dto: EmailCodeDto,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
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
    const refreshedUser = await this.users.refreshVerification(user);
    await this.recordSecurityEvent({
      eventType: 'Account',
      event: 'Email Verification',
      outcome: 'SUCCESS',
      actorType: refreshedUser.role === 'ADMIN' ? 'ADMIN' : 'USER',
      actorUserId: refreshedUser.id,
      targetUserId: refreshedUser.id,
      description: 'Account email verification completed.',
      ...context,
    });
    return this.issueSession(refreshedUser);
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

  async login(
    dto: LoginDto,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    const attemptedEmail = this.normalizeEmail(dto.email);
    let user = await this.users.findByEmail(attemptedEmail);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      await this.recordSecurityEvent({
        eventType: 'Login',
        event: 'Login Failed',
        outcome: 'FAILED',
        actorType: 'UNKNOWN',
        description: 'Authentication credentials were not verified.',
        metadata: { attemptedEmail },
        ...context,
      });
      throw new UnauthorizedException('Invalid email or password.');
    }
    if (!user.isEmailVerified) {
      await this.recordSecurityEvent({
        eventType: 'Login',
        event: 'Login Failed',
        outcome: 'FAILED',
        actorType: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
        actorUserId: user.id,
        targetUserId: user.id,
        description:
          'Authentication was rejected because email verification is incomplete.',
        metadata: { attemptedEmail },
        ...context,
      });
      throw new UnauthorizedException(
        'Please verify your email before signing in.',
      );
    }
    if (!user.isActive) {
      await this.recordSecurityEvent({
        eventType: 'Login',
        event: 'Login Failed',
        outcome: 'FAILED',
        actorType: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
        actorUserId: user.id,
        targetUserId: user.id,
        description:
          'Authentication was rejected because the account is inactive.',
        metadata: { attemptedEmail },
        ...context,
      });
      throw new UnauthorizedException('This account is inactive.');
    }
    const session = await this.issueSession(user);
    
    // Security check: Detect login from different IP
    if (context?.ipAddress) {
      try {
        const lastLogin = await (this.prisma as any).securityAuditEvent.findFirst({
          where: {
            actorUserId: user.id,
            eventType: 'Login',
            event: 'Successful Login',
            outcome: 'SUCCESS',
          },
          orderBy: { createdAt: 'desc' },
        });

        if (lastLogin?.ipAddress && lastLogin.ipAddress !== context.ipAddress) {
          this.logger.warn(
            `New login IP detected for ${user.email}: previous ${lastLogin.ipAddress}, current ${context.ipAddress}`,
          );

          // Check trigger in DB
          const trigger = await (this.prisma as any).notificationTrigger.findUnique({
            where: { id: 'TR-4001' },
          });

          if (!trigger || trigger.active) {
            // 1. Send Security Email to Gmail
            const isRealEmail =
              !user.email.endsWith('@test.com') &&
              !user.email.endsWith('.test') &&
              !user.email.endsWith('@example.com');
            if (isRealEmail) {
              await this.email.sendNewLoginAlertEmail(user.email, {
                firstName: user.firstName,
                ipAddress: context.ipAddress,
                userAgent: context.userAgent || 'NobleCards App',
                location: user.country || 'Unknown Location',
                timestamp: new Date(),
              });
            }

            // 2. Create in-app notification
            await (this.prisma as any).notification.create({
              data: {
                userId: user.id,
                title: 'New Login Detected',
                description: `We noticed a sign-in from an unrecognized device or IP address (${context.ipAddress}). If this wasn't you, secure your account.`,
                type: 'securityAlert',
                category: 'security',
                icon: 'shield',
                iconBgColor: '#EF4444',
                iconColor: '#FFFFFF',
                actionKey: 'security',
                details: [
                  { label: 'IP Address', value: context.ipAddress },
                  { label: 'Time', value: new Date().toLocaleTimeString() },
                  { label: 'Status', value: 'Delivered' },
                ],
                isRead: false,
                isPinned: true,
              },
            });

            // 3. Record in NotificationBroadcast
            await (this.prisma as any).notificationBroadcast.create({
              data: {
                id: `NT-${Date.now().toString().slice(-6)}`,
                type: 'Security',
                title: 'New Login Detected',
                message: `We noticed a login from an unrecognized device or IP address (${context.ipAddress}).`,
                audience: 'Specific User',
                channels: ['Email', 'In-App'],
                status: 'Delivered',
                delivered: '100%',
                read: '0%',
                createdBy: 'Security Team',
                sentDate: new Date(),
              },
            });
          }
        }
      } catch (loginSecErr: any) {
        this.logger.warn(`Failed checking login IP security: ${loginSecErr?.message}`);
      }
    }

    await this.recordSecurityEvent({
      eventType: 'Login',
      event: 'Successful Login',
      outcome: 'SUCCESS',
      actorType: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
      actorUserId: user.id,
      targetUserId: user.id,
      description: 'User authenticated successfully.',
      ...context,
    });
    return session;
  }

  async changePassword(
    userId: string,
    currentSessionId: string,
    currentPassword: string,
    newPassword: string,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    if (newPassword.length < 8) {
      throw new BadRequestException(
        'New password must be at least eight characters long.',
      );
    }
    const user = await this.users.findById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      await this.recordSecurityEvent({
        eventType: 'Password',
        event: 'Password Change Failed',
        outcome: 'FAILED',
        actorType: user
          ? user.role === 'ADMIN'
            ? 'ADMIN'
            : 'USER'
          : 'UNKNOWN',
        actorUserId: user?.id,
        targetUserId: user?.id,
        description:
          'Password change was rejected because the current password was not verified.',
        ...context,
      });
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
    await this.recordSecurityEvent({
      eventType: 'Password',
      event: 'Password Changed',
      outcome: 'SUCCESS',
      actorType: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
      actorUserId: userId,
      targetUserId: userId,
      description: 'Account password changed.',
      ...context,
    });
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

  async resetPassword(
    dto: ResetPasswordDto,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
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
    await this.recordSecurityEvent({
      eventType: 'Password',
      event: 'Password Reset',
      outcome: 'SUCCESS',
      actorType: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
      actorUserId: user.id,
      targetUserId: user.id,
      description: 'Account password reset completed.',
      ...context,
    });
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

  async biometricLogin(
    dto: BiometricLoginDto,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    const session = await this.prisma.refreshSession.findUnique({
      where: { tokenHash: this.hash(dto.refreshToken) },
      include: { user: true },
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new UnauthorizedException(
        'Biometric session expired. Please log in with your credentials.',
      );
    }
    const user = session.user;
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive.');
    }
    if (!user.biometricLoginEnabled) {
      throw new BadRequestException(
        'Biometric login is not enabled on this account. Please log in with your credentials and enable it in Settings.',
      );
    }

    await this.prisma.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    if (dto.biometricType && dto.biometricType !== user.biometricType) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { biometricType: dto.biometricType },
      });
      user.biometricType = dto.biometricType;
    }

    await this.recordSecurityEvent({
      eventType: 'Login',
      event: 'Biometric Login',
      outcome: 'SUCCESS',
      actorType: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
      actorUserId: user.id,
      targetUserId: user.id,
      description: `Biometric login succeeded (${dto.biometricType ?? user.biometricType ?? 'biometrics'}).`,
      ...context,
    });

    return this.issueSession(user);
  }

  async logout(
    sessionId: string,
    userId?: string,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    const user = userId
      ? await this.prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        })
      : null;
    await this.prisma.refreshSession.updateMany({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
    await this.recordSecurityEvent({
      eventType: 'Logout',
      event: 'Logout',
      outcome: 'SUCCESS',
      actorType:
        user?.role === 'ADMIN'
          ? 'ADMIN'
          : user?.role === 'USER'
            ? 'USER'
            : 'UNKNOWN',
      actorUserId: user ? userId : undefined,
      targetUserId: user ? userId : undefined,
      description: 'Authenticated session ended.',
      ...context,
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

  private async recordSecurityEvent(input: SecurityAuditEventInput) {
    try {
      await writeSecurityAuditEvent(this.prisma, input);
    } catch (error) {
      this.logger.error(
        `Unable to persist security event "${input.eventType}": ${
          error instanceof Error ? error.message : 'unknown database error'
        }`,
      );
    }
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

  async loginAdmin(
    dto: AdminLoginDto,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    if (!dto.adminPin || dto.adminPin.trim() !== '921340') {
      await this.recordSecurityEvent({
        eventType: 'Login',
        event: 'Admin Login Failed - Invalid Admin PIN',
        outcome: 'FAILED',
        actorType: 'ADMIN',
        description: 'Admin login rejected: Invalid Admin PIN provided.',
        metadata: { attemptedEmail: dto.email },
        ...context,
      });
      throw new UnauthorizedException('Invalid Admin PIN. Access denied.');
    }

    const attemptedEmail = this.normalizeEmail(dto.email);
    const user = await this.users.findByEmail(attemptedEmail);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      await this.recordSecurityEvent({
        eventType: 'Login',
        event: 'Admin Login Failed',
        outcome: 'FAILED',
        actorType: 'ADMIN',
        description: 'Admin authentication credentials were not verified.',
        metadata: { attemptedEmail },
        ...context,
      });
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.role !== 'ADMIN') {
      await this.recordSecurityEvent({
        eventType: 'Login',
        event: 'Admin Login Failed - Not Admin',
        outcome: 'FAILED',
        actorType: 'USER',
        actorUserId: user.id,
        targetUserId: user.id,
        description: 'Non-admin user attempted to access the admin portal.',
        metadata: { attemptedEmail },
        ...context,
      });
      throw new UnauthorizedException(
        'Access denied. Administrator privileges required.',
      );
    }

    if (!user.isActive) {
      await this.recordSecurityEvent({
        eventType: 'Login',
        event: 'Admin Login Failed - Inactive',
        outcome: 'FAILED',
        actorType: 'ADMIN',
        actorUserId: user.id,
        targetUserId: user.id,
        description:
          'Authentication was rejected because administrator account is inactive.',
        metadata: { attemptedEmail },
        ...context,
      });
      throw new UnauthorizedException(
        'This administrator account is inactive.',
      );
    }

    const session = await this.issueSession(user);

    await this.recordSecurityEvent({
      eventType: 'Login',
      event: 'Successful Admin Login',
      outcome: 'SUCCESS',
      actorType: 'ADMIN',
      actorUserId: user.id,
      targetUserId: user.id,
      description: 'Administrator authenticated successfully.',
      metadata: { attemptedEmail },
      ...context,
    });

    return session;
  }

  async registerAdmin(
    dto: AdminRegisterDto,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    if (!dto.adminPin || dto.adminPin.trim() !== '921340') {
      throw new UnauthorizedException('Invalid Admin PIN. Access denied.');
    }
    const email = this.normalizeEmail(dto.email);
    const existing = await this.users.findByEmail(email);

    if (existing) {
      throw new ConflictException(
        existing.role === 'ADMIN'
          ? 'An administrator account with this email already exists. Please sign in.'
          : 'An account with this email already exists as a user account. Admin registration requires a distinct email.',
      );
    }

    if (dto.phone?.trim()) {
      const existingPhone = await this.prisma.user.findFirst({
        where: { phone: dto.phone.trim() },
      });
      if (existingPhone) {
        throw new ConflictException('An account with this phone number already exists.');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const code = this.newCode();

    await this.prisma.pendingRegistration.upsert({
      where: { email },
      update: {
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone?.trim() || null,
        passwordHash,
        otpHash: this.hash(code),
        otpExpiresAt: this.otpExpiry(),
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
      },
      create: {
        email,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone?.trim() || null,
        passwordHash,
        otpHash: this.hash(code),
        otpExpiresAt: this.otpExpiry(),
        lastOtpSentAt: new Date(),
      },
    });

    try {
      await this.email.sendVerificationCode(email, code);
    } catch (emailErr) {
      this.logger.error(`Failed to send verification email to ${email}: ${emailErr}`);
    }

    await this.recordSecurityEvent({
      eventType: 'Account',
      event: 'Admin Registration Initiated',
      outcome: 'SUCCESS',
      actorType: 'ADMIN',
      description: `Admin registration initiated and OTP sent for ${email}`,
      ...context,
    });

    return {
      success: true,
      requiresVerification: true,
      email,
      message: 'A 6-digit verification code has been sent to your email address.',
    };
  }

  async verifyAdminOtp(
    dto: AdminVerifyOtpDto,
    context?: Pick<SecurityAuditEventInput, 'ipAddress' | 'userAgent'>,
  ) {
    if (!dto.adminPin || dto.adminPin.trim() !== '921340') {
      throw new UnauthorizedException('Invalid Admin PIN. Access denied.');
    }
    const email = this.normalizeEmail(dto.email);
    const pending = await this.prisma.pendingRegistration.findUnique({
      where: { email },
    });
    if (!pending) {
      throw new BadRequestException('No pending registration found for this email. Please register first.');
    }

    await this.checkCode(
      pending.otpHash,
      dto.otp,
      pending.otpExpiresAt,
      pending.otpAttempts,
      async (attempts) =>
        this.prisma.pendingRegistration.update({
          where: { id: pending.id },
          data: { otpAttempts: attempts },
        }),
    );

    const user = await this.prisma.user.create({
      data: {
        email: pending.email,
        passwordHash: pending.passwordHash,
        firstName: pending.firstName.trim(),
        lastName: pending.lastName.trim(),
        phone: pending.phone?.trim() || null,
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
        isProfileComplete: true,
        isVerified: true,
        referralCode: this.newReferralCode(),
      },
    });

    await this.prisma.pendingRegistration.delete({
      where: { id: pending.id },
    });

    await this.recordSecurityEvent({
      eventType: 'Account',
      event: 'Admin Email & PIN Verification',
      outcome: 'SUCCESS',
      actorType: 'ADMIN',
      actorUserId: user.id,
      targetUserId: user.id,
      description: `Administrator registration completed for ${user.email}`,
      ...context,
    });

    const session = await this.issueSession(user);
    return {
      success: true,
      message: 'Admin account verified successfully.',
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
