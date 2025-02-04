import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateRealtyDetailsRequest } from './create-realty_details.request';
import { CreateInvestmentDetails } from './create-investment-details.request';

export class CreateRealtyRequest {
  @IsOptional()
  background_image: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  owner_name: string;

  @IsOptional()
  @IsNumber()
  net_quarter?: number;

  @IsOptional()
  @IsNumber()
  net_return?: number;

  @IsOptional()
  @IsNumber()
  down_payment?: number;

  @IsOptional()
  is_available: boolean;

  @IsOptional()
  is_active: boolean;

  @IsNotEmpty()
  details: CreateRealtyDetailsRequest;

  @IsNotEmpty()
  investment_details: CreateInvestmentDetails;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  images?: { description: string }[];
}
