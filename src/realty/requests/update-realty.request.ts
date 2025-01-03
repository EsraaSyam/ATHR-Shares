import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateRealtyDetailsRequest } from './create-realty_details.request';
import { CreateInvestmentDetails } from './create-investment-details.request';

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
  @IsNumber()
  net_quarter?: number;

  @IsOptional()
  @IsNumber()
  net_return?: number;

  @IsOptional()
  @IsNumber()
  down_payment?: number;

  @IsOptional()
  is_avaliable: boolean = true;

  @IsOptional()
  is_active: boolean = true;

  @IsOptional()
  details: CreateRealtyDetailsRequest;

  @IsOptional()
  investment_details: CreateInvestmentDetails;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  images?: { description: string }[];
}
