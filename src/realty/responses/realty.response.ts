import { InvestmentDetailsResponses } from "./investment-details.response";
import { RealtyDetailsResponss } from "./realty-details.response";

export class RealtyResponse {
    id: number;
    background_image: string;
    title: string;
    owner_name: string;
    net_quarter?: number;
    sale_date?: Date;
    net_return?: number;
    down_payment?: number;
    is_avaliable: boolean;
    is_active: boolean;
    user_id?: number;
    details: RealtyDetailsResponss;
    investmentDetails: InvestmentDetailsResponses;

    constructor(realty: any) {
        this.id = realty.id;
        this.background_image = realty.background_image;
        this.title = realty.title;
        this.owner_name = realty.owner_name;
        this.is_avaliable = realty.is_avaliable;
        this.is_active = realty.is_active;
        this.user_id = realty.user_id;
    

        if (realty.is_avaliable) {
            this.down_payment = realty.down_payment;
        } else {
            this.net_quarter = realty.net_quarter;
            this.sale_date = realty.sale_date;
            this.net_return = realty.net_return;
        }


        this.details = realty.details ? new RealtyDetailsResponss(realty.details) : null;
        this.investmentDetails = realty.investmentDetails ? new InvestmentDetailsResponses(realty.investmentDetails) : null;
    }
}
