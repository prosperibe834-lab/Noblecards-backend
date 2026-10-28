import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class AdminReferralsQueryDto {
  @IsOptional() @IsString() @MaxLength(120) search?: string;
  @IsOptional() @IsString() @MaxLength(60) status?: string;
  @IsOptional() @IsString() @MaxLength(60) rewardStatus?: string;
  @IsOptional() @IsString() @MaxLength(80) country?: string;
  @IsOptional() @IsString() @MaxLength(40) dateRange?: string;
  @IsOptional() @IsString() @MaxLength(40) customStart?: string;
  @IsOptional() @IsString() @MaxLength(40) customEnd?: string;
  @IsOptional() @IsString() sortBy = 'createdAt';
  @IsOptional() @IsIn(['asc', 'desc']) sortOrder: 'asc' | 'desc' = 'desc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 25;
}

export class ReferralReviewDto {
  @IsIn(['HOLD', 'RELEASE', 'REJECT']) action!: 'HOLD' | 'RELEASE' | 'REJECT';
  @IsString() @MaxLength(500) reason!: string;
}

export class UpdateCommissionRateDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(100)
  rate!: number;

  @IsString()
  @MaxLength(500)
  reason!: string;
}

export class ToggleProgramStatusDto {
  @IsBoolean()
  active!: boolean;
}

