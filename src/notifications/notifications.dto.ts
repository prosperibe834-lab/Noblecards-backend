import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class BroadcastChannelsDto {
  @IsOptional()
  @IsBoolean()
  inApp?: boolean;

  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @IsOptional()
  @IsBoolean()
  sms?: boolean;
}

export class CreateBroadcastDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  audience?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsObject()
  channels?: BroadcastChannelsDto;

  @IsOptional()
  @IsString()
  scheduleType?: string;

  @IsOptional()
  @IsString()
  scheduleDate?: string;
}

export class ToggleTriggerDto {
  @IsBoolean()
  active!: boolean;
}

export class UserNotificationsQueryDto {
  @IsOptional()
  @IsString()
  category?: string;
}

export class AdminNotificationsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  page?: string | number;

  @IsOptional()
  limit?: string | number;
}
