import { InvestmentDetailsResponses } from "./investment-details.response";
import { RealtyDetailsResponss } from "./realty-details.response";
import { RealtyImagesResponse } from "./realty-images.response";

export class RealtyResponse {
    id: number;
    background_image: string;
    title: string;
    owner_name: string;
    net_quarter?: number;
    sale_date?: Date;
    net_return?: number;
    is_available: boolean;
    is_active: boolean;
    details: RealtyDetailsResponss;
    investmentDetails: InvestmentDetailsResponses;
    realty_images: RealtyImagesResponse[];
    service_change: number;

    constructor(realty: any) {
        this.id = realty.id;
        this.title = realty.title;
        this.owner_name = realty.owner_name;
        this.is_available = realty.is_available;
        this.is_active = realty.is_active;




        this.details = realty.details ? new RealtyDetailsResponss(realty.details) : null;
        this.investmentDetails = realty.investmentDetails ? new InvestmentDetailsResponses(realty.investmentDetails) : null;
        // this.realty_images = realty.images ? realty.images.map((image: any) => new RealtyImagesResponse(image)) : [];


        this.net_quarter = realty.net_quarter;
        this.sale_date = realty.sale_date;
        this.net_return = realty.net_return;

    }
}
