import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateRealtyDetailsRequest } from './create-realty_details.request';
import { CreateInvestmentDetails } from './create-investment-details.request';

export class CreateRealtyRequest {
  @IsNotEmpty()
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
  is_avaliable: boolean = true;

  @IsOptional()
  is_active: boolean = true;

  @IsNotEmpty()
  details: CreateRealtyDetailsRequest;

  @IsNotEmpty()
  investmentDetails: CreateInvestmentDetails;
}
