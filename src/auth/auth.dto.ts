import { IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsString() @MinLength(1) firstName!: string;
  @IsString() @MinLength(1) lastName!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() countryCode?: string;
  @IsOptional() @IsString() gender?: string;
}

export class EmailCodeDto {
  @IsEmail() email!: string;
  @Matches(/^\d{6}$/) code!: string;
}

export class EmailDto {
  @IsEmail() email!: string;
}

export class LoginDto extends EmailDto {
  @IsString() @MinLength(1) password!: string;
}

export class ResetPasswordDto extends EmailCodeDto {
  @IsString() @MinLength(8) newPassword!: string;
}

export class RefreshDto {
  @IsString() @MinLength(20) refreshToken!: string;
}

export class ResendOtpDto extends EmailDto {
  @IsOptional() @IsIn(['signup', 'password-recovery']) purpose?: 'signup' | 'password-recovery';
}