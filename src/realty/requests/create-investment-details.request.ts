import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateInvestmentDetails {

    @IsNotEmpty()
    @IsNumber()
    net_share_price: number;

    @IsNotEmpty()
    @IsNumber()
    down_payment: number;

    @IsNotEmpty()
    payment_plan: {
        month_12?: number;
        month_18?: number;
        month_24?: number;
    };

    @IsNotEmpty()
    service_charge: number;
}