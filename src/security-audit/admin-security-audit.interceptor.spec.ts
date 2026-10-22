import { lastValueFrom, of } from 'rxjs';
import { AdminSecurityAuditInterceptor } from './admin-security-audit.interceptor';
import { SecurityAuditService } from './security-audit.service';

describe('AdminSecurityAuditInterceptor', () => {
  it('records mutations using the persisted actor role, not the route prefix', async () => {
    const audit = {
      resolveActorType: jest.fn().mockResolvedValue('ADMIN'),
      record: jest.fn().mockResolvedValue(undefined),
    };
    const interceptor = new AdminSecurityAuditInterceptor(
      audit as unknown as SecurityAuditService,
    );
    const request = {
      method: 'PATCH',
      originalUrl: '/admin/users/user-2?source=dashboard',
      baseUrl: '/admin/users',
      route: { path: '/:id' },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'test-browser' },
      user: { userId: 'admin-1' },
    };
    const response = { statusCode: 200 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    };

    await lastValueFrom(
      interceptor.intercept(context as never, {
        handle: () => of({ updated: true }),
      }),
    );

    expect(audit.resolveActorType).toHaveBeenCalledWith('admin-1');
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'Admin',
        actorType: 'ADMIN',
        actorUserId: 'admin-1',
        event: 'PATCH /admin/users/:id',
        outcome: 'SUCCESS',
      }),
    );
  });

  it('keeps an unauthenticated admin-route mutation unattributed', async () => {
    const audit = {
      resolveActorType: jest.fn(),
      record: jest.fn().mockResolvedValue(undefined),
    };
    const interceptor = new AdminSecurityAuditInterceptor(
      audit as unknown as SecurityAuditService,
    );
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          originalUrl: '/admin/action',
          headers: {},
        }),
        getResponse: () => ({ statusCode: 401 }),
      }),
    };

    await lastValueFrom(
      interceptor.intercept(context as never, { handle: () => of(null) }),
    );

    expect(audit.resolveActorType).not.toHaveBeenCalled();
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        actorType: 'UNKNOWN',
        actorUserId: undefined,
        outcome: 'FAILED',
      }),
    );
  });
});
