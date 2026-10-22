import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityAuditService } from '../security-audit/security-audit.service';
import { recordAdminAccessDenied } from '../security-audit/security-audit.utils';

@Injectable()
export class AdminDashboardGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly audit?: SecurityAuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: { userId: string };
      headers?: { 'user-agent'?: string | string[] };
      ip?: string;
      method?: string;
      originalUrl?: string;
    }>();
    const user = await this.prisma.user.findUnique({
      where: { id: request.user.userId },
      select: { role: true, isActive: true },
    });
    if (!user?.isActive || user.role !== 'ADMIN') {
      await recordAdminAccessDenied(this.audit, request, user?.role);
      throw new ForbiddenException('Admin access required.');
    }
    return true;
  }
}
