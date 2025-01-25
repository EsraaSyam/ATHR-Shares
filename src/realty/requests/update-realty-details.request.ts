import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRealtyDetailsRequest {
    @IsOptional()
    bathroom_count: number;

    @IsOptional()
    room_count: number;

    @IsOptional()
    area: number;

    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    price: number;

    @IsOptional()
    @IsString()
    features: string;

    @IsOptional()
    @IsString()
    longitude: string;

    @IsOptional()
    @IsString()
    latitude: string;

    @IsOptional()
    net_share_count: number;
}