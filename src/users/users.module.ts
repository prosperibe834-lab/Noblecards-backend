import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersGuard } from './admin-users.guard';

@Module({
  imports: [forwardRef(() => AuthModule), EmailModule],
  providers: [UsersService, AdminUsersGuard],
  controllers: [UsersController, AdminUsersController],
  exports: [UsersService],
})
export class UsersModule {}