import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminVerifyOtpDto,
  BiometricLoginDto,
  ChangePasswordDto,
  EmailCodeDto,
  EmailDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
} from './auth.dto';

type RequestContext = {
  ip?: string;
  headers: { 'user-agent'?: string | string[] };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/register') registerAdmin(
    @Body() dto: AdminRegisterDto,
    @Req() request: RequestContext,
  ) {
    return this.authService.registerAdmin(dto, this.requestContext(request));
  }

  @Post('admin/verify-otp') verifyAdminOtp(
    @Body() dto: AdminVerifyOtpDto,
    @Req() request: RequestContext,
  ) {
    return this.authService.verifyAdminOtp(dto, this.requestContext(request));
  }

  @Post('admin/login') loginAdmin(
    @Body() dto: AdminLoginDto,
    @Req() request: RequestContext,
  ) {
    return this.authService.loginAdmin(dto, this.requestContext(request));
  }

  @Post('register') register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('verify-email') verifyEmail(
    @Body() dto: EmailCodeDto,
    @Req() request: RequestContext,
  ) {
    return this.authService.verifyEmail(dto, this.requestContext(request));
  }
  @Post('resend-otp') resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }
  @Post('login') login(@Body() dto: LoginDto, @Req() request: RequestContext) {
    return this.authService.login(dto, this.requestContext(request));
  }
  @Post('forgot-password') forgotPassword(@Body() dto: EmailDto) {
    return this.authService.forgotPassword(dto);
  }
  @Post('reset-password') resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() request: RequestContext,
  ) {
    return this.authService.resetPassword(dto, this.requestContext(request));
  }
  @Post('refresh') refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('biometric-login')
  biometricLogin(
    @Body() dto: BiometricLoginDto,
    @Req() request: RequestContext,
  ) {
    return this.authService.biometricLogin(dto, this.requestContext(request));
  }

  @Post('biometric/login')
  biometricLoginAlias(
    @Body() dto: BiometricLoginDto,
    @Req() request: RequestContext,
  ) {
    return this.authService.biometricLogin(dto, this.requestContext(request));
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @Req()
    request: RequestContext & { user: { userId: string; sessionId: string } },
  ) {
    return this.authService.logout(
      request.user.sessionId,
      request.user.userId,
      this.requestContext(request),
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() request: { user: { userId: string } }) {
    return this.authService.me(request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  changePassword(
    @Req()
    request: RequestContext & { user: { userId: string; sessionId: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      request.user.userId,
      request.user.sessionId,
      dto.currentPassword,
      dto.newPassword,
      this.requestContext(request),
    );
  }

  private requestContext(request: RequestContext) {
    const userAgent = request.headers['user-agent'];
    return {
      ipAddress: request.ip ?? null,
      userAgent: Array.isArray(userAgent)
        ? (userAgent[0] ?? null)
        : (userAgent ?? null),
    };
  }
}
