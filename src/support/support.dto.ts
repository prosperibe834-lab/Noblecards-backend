import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';

export enum SupportTicketCategoryDto {
  ACCOUNT = 'ACCOUNT',
  PAYMENT = 'PAYMENT',
  WITHDRAWAL = 'WITHDRAWAL',
  GIFT_CARD = 'GIFT_CARD',
  TECHNICAL = 'TECHNICAL',
  GENERAL = 'GENERAL',
}

export enum SupportTicketStatusDto {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum SupportTicketPriorityDto {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateSupportTicketDto {
  @IsString()
  @Length(3, 200)
  subject!: string;

  @IsEnum(SupportTicketCategoryDto)
  category!: SupportTicketCategoryDto;

  @IsOptional()
  @IsEnum(SupportTicketPriorityDto)
  priority?: SupportTicketPriorityDto;

  @IsString()
  @Length(1, 4000)
  message!: string;
}

export class SendSupportMessageDto {
  @IsOptional()
  @IsString()
  @Length(1, 4000)
  message?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}

export class UpdateSupportTicketStatusDto {
  @IsEnum(SupportTicketStatusDto)
  status!: SupportTicketStatusDto;

  @IsOptional()
  @IsEnum(SupportTicketPriorityDto)
  priority?: SupportTicketPriorityDto;
}

export class UpdateSupportTicketAssignmentDto {
  @IsOptional()
  @IsString()
  assignedToId?: string | null;
}

export class SupportQueryDto {
  @IsOptional()
  @IsEnum(SupportTicketStatusDto)
  status?: SupportTicketStatusDto;

  @IsOptional()
  @IsEnum(SupportTicketPriorityDto)
  priority?: SupportTicketPriorityDto;

  @IsOptional()
  @IsEnum(SupportTicketCategoryDto)
  category?: SupportTicketCategoryDto;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;
}

export class SupportAdminSummaryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
