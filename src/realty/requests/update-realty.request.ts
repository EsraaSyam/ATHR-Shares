import { IsArray, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateRealtyDetailsRequest } from './update-realty-details.request';
import { UpdateInvestmentDetails } from './update-investment-details';

export class UpdateRealtyRequest {
  @IsOptional()
  background_image: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  owner_name: string;

  @IsOptional()
  net_quarter?: number;

  @IsOptional()
  net_return?: number;

  @IsOptional()
  sale_date?: string;

  @IsOptional()
  down_payment?: number;

  @IsOptional()
  is_avaliable: boolean = true;

  @IsOptional()
  is_active: boolean = true;

  @IsOptional()
  details: UpdateRealtyDetailsRequest;

  @IsOptional()
  investment_details: UpdateInvestmentDetails;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  images?: { description: string }[];
}
