import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('__test/create-user')
  async createTestUser(@Body() body?: { email?: string; password?: string; firstName?: string; lastName?: string }) {
    // Test endpoint - use with caution in production
    const email = (body?.email || `reg-test-${Date.now()}@test.com`).toLowerCase();
    const passwordHash = await bcrypt.hash(body?.password || 'Test@123', 12);
    const userId = crypto.randomUUID();
    const walletId = crypto.randomUUID();
    const now = new Date();

    try {
      // Use raw SQL to insert user directly
      await this.prisma.$executeRaw`
        INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", "isEmailVerified", "isActive", "createdAt", "updatedAt")
        VALUES (${userId}, ${email}, ${passwordHash}, ${body?.firstName || 'Test'}, ${body?.lastName || 'User'}, true, true, ${now}, ${now});
      `;

      // Create wallet
      await this.prisma.$executeRaw`
        INSERT INTO "Wallet" (id, "userId", "createdAt", "updatedAt")
        VALUES (${walletId}, ${userId}, ${now}, ${now});
      `;

      this.logger.log(`Test user created: ${userId}`);

      return {
        userId,
        email,
        walletId,
      };
    } catch (error) {
      this.logger.error(`Error creating test user: ${error}`);
      return { error: error instanceof Error ? error.message : 'Failed to create user' };
    }
  }
}
