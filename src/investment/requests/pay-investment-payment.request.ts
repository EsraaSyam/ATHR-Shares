import { IsOptional } from "class-validator";
import { PaymentMethods } from "src/payment/payment.enum";

export class PayInvestmentPaymentRequest {
    realty_id: number;

    @IsOptional()
    user_id: number;

    payment_method: PaymentMethods;

    @IsOptional()
    payment_image: string;
}