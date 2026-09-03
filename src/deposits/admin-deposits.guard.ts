import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminDepositsGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user: { userId: string } }>();
    const user = await this.prisma.user.findUnique({ where: { id: request.user.userId }, select: { role: true, isActive: true } });
    if (!user?.isActive || user.role !== 'ADMIN') throw new ForbiddenException('Admin access required.');
    return true;
  }
}