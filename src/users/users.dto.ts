import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
    @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @Length(1, 80) firstName?: string;
  @IsOptional() @IsString() @Length(1, 80) lastName?: string;
  @IsOptional() @Matches(/^[a-zA-Z0-9_]{3,30}$/) username?: string;
  @IsOptional() @IsString() @MaxLength(120) displayName?: string;
  @IsOptional() @Matches(/^\+?[0-9 ()-]{7,20}$/) phone?: string;
  @IsOptional() @IsString() @MaxLength(80) country?: string;
  @IsOptional() @IsString() @MaxLength(8) countryCode?: string;
  @IsOptional() @IsString() @MaxLength(40) gender?: string;
  @IsOptional() @IsString() @MaxLength(40) dateOfBirth?: string;
  @IsOptional() @IsString() @MaxLength(500) bio?: string;
  @IsOptional() @IsString() @MaxLength(250) address?: string;
  @IsOptional() @IsString() @MaxLength(500) profileImageUrl?: string;
}
