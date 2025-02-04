import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRealtyDetailsRequest {
  @IsNotEmpty()
  @IsNumber()
  bathroom_count: number;

  @IsNotEmpty()
  @IsNumber()
  room_count: number;

  @IsNotEmpty()
  @IsNumber()
  area: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  features: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsNumber()
  net_share_count: number;
}
