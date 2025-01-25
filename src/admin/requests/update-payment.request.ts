import { InstallmentType, PaymentStatus } from "src/payment/payment.enum";

export class UpdatePaymentRequest {
    net_share_count: number;
    payment_status: PaymentStatus;
    installment_type: InstallmentType;
}