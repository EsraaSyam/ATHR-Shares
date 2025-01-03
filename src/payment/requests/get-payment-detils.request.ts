import { IsOptional } from "class-validator";
import { InstallmentType, PaymentTypes } from "../payment.enum";

export class GetPaymentDetailsRequest {
    realty_id: number;

    payment_type: PaymentTypes;

    @IsOptional()
    installment_type: InstallmentType;

    @IsOptional()
    net_share_count: number;
}