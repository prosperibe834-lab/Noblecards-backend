import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminUsersGuard } from './admin-users.guard';
import { UsersService } from './users.service';

@Controller('admin/users')
@UseGuards(AuthGuard, AdminUsersGuard)
export class AdminUsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  getUsers(@Query() query: Record<string, string | undefined>) {
    return this.users.getAdminUsers(query);
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.users.createAdminUser(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.users.updateAdminUser(id, body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Query('status') status: string) {
    return this.users.updateAdminUserStatus(id, status);
  }

  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.users.deactivateAdminUser(id);
  }
}