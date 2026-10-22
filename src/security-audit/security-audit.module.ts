import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminDashboardGuard } from '../dashboard/admin-dashboard.guard';
import { ADMIN_SECURITY_AUDIT_INTERCEPTOR } from './admin-security-audit.interceptor';
import { SecurityAuditController } from './security-audit.controller';
import { SecurityAuditService } from './security-audit.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [SecurityAuditController],
  providers: [
    AdminDashboardGuard,
    SecurityAuditService,
    ADMIN_SECURITY_AUDIT_INTERCEPTOR,
  ],
  exports: [SecurityAuditService],
})
export class SecurityAuditModule {}
