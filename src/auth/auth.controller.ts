import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { EmailCodeDto, EmailDto, LoginDto, RefreshDto, RegisterDto, ResendOtpDto, ResetPasswordDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') register(@Body() dto: RegisterDto) { return this.authService.register(dto); }
  @Post('verify-email') verifyEmail(@Body() dto: EmailCodeDto) { return this.authService.verifyEmail(dto); }
  @Post('resend-otp') resendOtp(@Body() dto: ResendOtpDto) { return this.authService.resendOtp(dto); }
  @Post('login') login(@Body() dto: LoginDto) { return this.authService.login(dto); }
  @Post('forgot-password') forgotPassword(@Body() dto: EmailDto) { return this.authService.forgotPassword(dto); }
  @Post('reset-password') resetPassword(@Body() dto: ResetPasswordDto) { return this.authService.resetPassword(dto); }
  @Post('refresh') refresh(@Body() dto: RefreshDto) { return this.authService.refresh(dto.refreshToken); }

  @UseGuards(AuthGuard)
  @Post('logout') logout(@Req() request: { user: { sessionId: string } }) { return this.authService.logout(request.user.sessionId); }

  @UseGuards(AuthGuard)
  @Get('me') me(@Req() request: { user: { userId: string } }) { return this.authService.me(request.user.userId); }
}