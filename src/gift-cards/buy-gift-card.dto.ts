import { IsIn, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export class BuyGiftCardCatalogQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}$/)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(3, 10)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  product?: string;

  @IsOptional()
  @IsIn(['TOPUPMATE', 'topupmate'])
  provider?: string;
}
