import { IsOptional } from "class-validator";

export class CreatePaymentRequest {
    realty_id: number;

    is_buy_unit: boolean;

    is_cash_payment: boolean;

    net_share_count: number;

    installment_type: boolean[] = [false, false, false];

    payment_method: string;

    payment_image: string;
}