import { IsNumber, IsOptional } from "class-validator";

export class UpdateInvestmentDetails {
    @IsOptional()
    net_share_price: number;

    @IsOptional()
    down_payment: number;

    @IsOptional()
    payment_plan: {
        month_12?: number;
        month_18?: number;
        month_24?: number;
    };

    @IsOptional()
    service_charge: number;
}