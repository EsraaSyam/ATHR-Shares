export class InvestmentDetailsResponses {
    id: number;
    unit_price: number;
    net_share_price: number;
    down_payment: number;
    payment_plan: {
        month_12?: number;
        month_18?: number;
        month_24?: number;
    };
    service_charge: number;

    constructor(details: any) {
        this.id = details.id;
        this.unit_price = details.unit_price;
        this.net_share_price = details.net_share_price;
        this.down_payment = details.down_payment;
        this.payment_plan = details.payment_plan;
        this.service_charge = details.service_charge;
    }
}