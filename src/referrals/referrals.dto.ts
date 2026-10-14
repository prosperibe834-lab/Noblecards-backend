import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class AdminReferralsQueryDto {
  @IsOptional() @IsString() @MaxLength(120) search?: string;
  @IsOptional()
  @IsIn(['REGISTERED', 'DEPOSIT_QUALIFIED', 'QUALIFIED', 'HELD', 'REJECTED'])
  status?: string;
  @IsOptional()
  @IsIn(['PENDING', 'AVAILABLE', 'HELD', 'REJECTED', 'REVERSED'])
  rewardStatus?: string;
  @IsOptional() @IsString() @MaxLength(80) country?: string;
  @IsOptional() @IsIn(['createdAt', 'status']) sortBy = 'createdAt';
  @IsOptional() @IsIn(['asc', 'desc']) sortOrder: 'asc' | 'desc' = 'desc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 25;
}

export class ReferralReviewDto {
  @IsIn(['HOLD', 'RELEASE', 'REJECT']) action!: 'HOLD' | 'RELEASE' | 'REJECT';
  @IsString() @MaxLength(500) reason!: string;
}
