import { BadRequestException, Body, Controller, Delete, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AuthGuard } from '../auth/auth.guard';
import {
  CompleteTransactionPinResetDto,
  CreateOrUpdateTransactionPinDto,
  UpdateBiometricSettingsDto,
  UpdateProfileDto,
  VerifyTransactionPinDto,
  VerifyTransactionPinResetCodeDto,
} from './users.dto';
import { UsersService } from './users.service';

const uploadDirectory = join(process.cwd(), 'uploads', 'profile');
mkdirSync(uploadDirectory, { recursive: true });

@Controller('users/me')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  async getProfile(@Req() request: { user: { userId: string } }) {
    const user = await this.users.findById(request.user.userId);
    return { user: user ? this.users.toPublicUser(user) : null };
  }

  @Get('account-tier')
  async getAccountTier(@Req() request: { user: { userId: string } }) {
    return this.users.getUserAccountTier(request.user.userId);
  }

  @Get('profile-stats')
  async getProfileStats(@Req() request: { user: { userId: string } }) {
    return this.users.getUserProfileStats(request.user.userId);
  }

  @Get('transaction-pin')
  async getTransactionPinStatus(@Req() request: { user: { userId: string } }) {
    return { hasTransactionPin: await this.users.hasTransactionPin(request.user.userId) };
  }

  @Get('biometrics')
  async getBiometricSettings(@Req() request: { user: { userId: string } }) {
    return this.users.getBiometricSettings(request.user.userId);
  }

  @Patch('biometrics')
  async updateBiometricSettings(
    @Req()
    request: {
      user: { userId: string };
      ip?: string;
      headers: { 'user-agent'?: string | string[] };
    },
    @Body() dto: UpdateBiometricSettingsDto,
  ) {
    const userAgent = request.headers?.['user-agent'];
    const context = {
      ipAddress: request.ip ?? null,
      userAgent: Array.isArray(userAgent)
        ? (userAgent[0] ?? null)
        : (userAgent ?? null),
    };
    return this.users.updateBiometricSettings(request.user.userId, dto, context);
  }

  @Post('biometrics/verify-pin')
  async verifyPinForBiometrics(
    @Req() request: { user: { userId: string } },
    @Body() dto: VerifyTransactionPinDto,
  ) {
    await this.users.verifyTransactionPin(request.user.userId, dto.pin);
    return { verified: true };
  }

  @Post('biometrics/authorize-transaction')
  async authorizeBiometricTransaction(
    @Req()
    request: {
      user: { userId: string };
      ip?: string;
      headers: { 'user-agent'?: string | string[] };
    },
  ) {
    const userAgent = request.headers?.['user-agent'];
    const context = {
      ipAddress: request.ip ?? null,
      userAgent: Array.isArray(userAgent)
        ? (userAgent[0] ?? null)
        : (userAgent ?? null),
    };
    return this.users.authorizeBiometricTransaction(request.user.userId, context);
  }

  @Post('transaction-pin')
  async createTransactionPin(
    @Req() request: { user: { userId: string } },
    @Body() dto: CreateOrUpdateTransactionPinDto,
  ) {
    if (dto.pin !== undefined && dto.currentPin === undefined && dto.newPin === undefined) {
      await this.users.createTransactionPin(request.user.userId, dto.pin);
      return { created: true, hasTransactionPin: true };
    }
    if (dto.pin === undefined && dto.currentPin !== undefined && dto.newPin !== undefined) {
      await this.users.updateTransactionPin(request.user.userId, dto.currentPin, dto.newPin);
      return { updated: true, hasTransactionPin: true };
    }
    throw new BadRequestException('Provide either pin or currentPin and newPin.');
  }

  @Post('transaction-pin/verify')
  async verifyTransactionPin(
    @Req() request: { user: { userId: string } },
    @Body() dto: VerifyTransactionPinDto,
  ) {
    await this.users.verifyTransactionPin(request.user.userId, dto.pin);
    return { verified: true };
  }

  @Post('transaction-pin/reset/request')
  async requestTransactionPinReset(@Req() request: { user: { userId: string } }) {
    return this.users.requestTransactionPinReset(request.user.userId);
  }

  @Post('transaction-pin/reset/verify')
  async verifyTransactionPinReset(
    @Req() request: { user: { userId: string } },
    @Body() dto: VerifyTransactionPinResetCodeDto,
  ) {
    return this.users.verifyTransactionPinResetCode(request.user.userId, dto.code);
  }

  @Post('transaction-pin/reset/complete')
  async completeTransactionPinReset(
    @Req() request: { user: { userId: string } },
    @Body() dto: CompleteTransactionPinResetDto,
  ) {
    return this.users.completeTransactionPinReset(request.user.userId, dto.resetToken, dto.pin, dto.confirmPin);
  }

  @Patch()
  async updateProfile(@Req() request: { user: { userId: string } }, @Body() dto: UpdateProfileDto) {
    return { user: this.users.toPublicUser(await this.users.updateProfile(request.user.userId, dto)) };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: uploadDirectory,
      filename: (_request, file, callback) => callback(null, `${randomBytes(24).toString('hex')}.${file.mimetype.split('/')[1]}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
  }))
  async uploadImage(@Req() request: { user: { userId: string } }, @UploadedFile() file?: { filename: string }) {
    if (!file) throw new BadRequestException('A valid JPG, PNG, or WEBP image under 5MB is required.');
    const url = `/uploads/profile/${file.filename}`;
    return { user: this.users.toPublicUser(await this.users.setProfileImage(request.user.userId, url)) };
  }

  @Delete('image')
  async deleteImage(@Req() request: { user: { userId: string } }) {
    return { user: this.users.toPublicUser(await this.users.setProfileImage(request.user.userId, null)) };
  }

  @Delete()
  async deleteAccount(@Req() request: { user: { userId: string } }) {
    return this.users.deleteAccount(request.user.userId);
  }
}

