import { IsOptional } from "class-validator";

export class GetInvestmentPaymentDetailsRequest {
    realty_id: number;

    @IsOptional()
    user_id: number;
}