
export class GetInvestmentPaymentDetailsUniteRequest {
    unit_price: number;

    down_payment: number;

    paid_installment: number;

    next_installment_price: number;

    next_installment_date: Date;

    total_price: number;

    constructor(data: any) {
        this.unit_price = data.unit_price;
        this.down_payment = data.down_payment;
        this.paid_installment = data.paid_installment;
        this.next_installment_price = data.next_installment_price;
        this.next_installment_date = data.next_installment_date;
        this.total_price = data.total_price;
    }
}