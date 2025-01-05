import { IsNotEmpty, IsOptional } from "class-validator";
import { InstallmentType, PaymentTypes, PaymentMethods } from "../payment.enum";

export class CreatePaymentRequest {
    @IsNotEmpty({message: "Please enter realty id"})
    realty_id: number;

    @IsNotEmpty({message: "Please enter payment type"})
    payment_type: PaymentTypes;

    @IsOptional()
    installment_type: InstallmentType;

    @IsOptional()
    net_share_count: number = 0;

    @IsNotEmpty({message: "Please enter payment method"})
    payment_method: PaymentMethods;

    // @IsNotEmpty({message: "Please upload payment image"})
    payment_image?: string;

    @IsOptional()
    user_id?: number;
}