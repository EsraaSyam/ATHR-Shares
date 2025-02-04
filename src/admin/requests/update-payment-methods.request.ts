import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePaymentMethodsRequest {
    @IsString()
    @IsOptional()
    method_name: string;

    @IsString()
    @IsOptional()
    value: string;

    @IsBoolean()
    @IsOptional()   
    is_active: boolean;
}