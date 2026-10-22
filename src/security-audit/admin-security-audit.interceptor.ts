import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { catchError, concatMap, from, Observable, throwError } from 'rxjs';
import { SecurityAuditService } from './security-audit.service';

type AdminRequest = {
  method: string;
  originalUrl: string;
  baseUrl?: string;
  route?: { path?: string };
  ip?: string;
  headers: { 'user-agent'?: string | string[] };
  user?: { userId?: string };
};

@Injectable()
export class AdminSecurityAuditInterceptor implements NestInterceptor {
  constructor(private readonly audit: SecurityAuditService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<AdminRequest>();
    const response = http.getResponse<{ statusCode?: number }>();
    const method = request.method.toUpperCase();
    const isAdminMutation =
      request.originalUrl.split('?')[0].startsWith('/admin/') &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) &&
      !request.originalUrl.split('?')[0].startsWith('/admin/security-logs');

    if (!isAdminMutation) return next.handle();

    return next.handle().pipe(
      concatMap(async (value) => {
        await this.record(request, method, response.statusCode ?? 200);
        return value;
      }),
      catchError((error: unknown) =>
        from(this.record(request, method, this.statusFromError(error))).pipe(
          concatMap(() => throwError(() => error)),
        ),
      ),
    );
  }

  private async record(request: AdminRequest, method: string, status: number) {
    const route =
      `${request.baseUrl ?? ''}${request.route?.path ?? request.originalUrl.split('?')[0]}`.slice(
        0,
        200,
      );
    const userAgent = request.headers['user-agent'];
    const actorType = request.user?.userId
      ? await this.audit.resolveActorType(request.user.userId)
      : 'UNKNOWN';
    await this.audit.record({
      eventType: 'Admin',
      event: `${method} ${route}`,
      outcome: status >= 400 ? 'FAILED' : 'SUCCESS',
      actorType,
      actorUserId: actorType === 'UNKNOWN' ? undefined : request.user?.userId,
      ipAddress: request.ip,
      userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
      description: `Administrative request completed with HTTP ${status}.`,
      metadata: { method, route, httpStatus: status },
    });
  }

  private statusFromError(error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof error.status === 'number'
    ) {
      return error.status;
    }
    return 500;
  }
}

export const ADMIN_SECURITY_AUDIT_INTERCEPTOR = {
  provide: APP_INTERCEPTOR,
  useClass: AdminSecurityAuditInterceptor,
};
