import { RealtyDetailsEntity } from "src/realty/entities/realty_details.entity";
import { InvestmentDetailsEntity } from "./investment-details.entity";
import { RealtyImagesEntity } from "./realty-images.entity";
import { RealtyBackgroundEntity } from "./realty-background.entity";
export declare class RealtyEntity {
    id: number;
    is_avaliable?: boolean;
    is_active?: boolean;
    background_image: RealtyBackgroundEntity;
    title: string;
    owner_name: string;
    net_quarter?: number;
    sale_date?: Date;
    net_return?: number;
    down_payment?: number;
    user_id?: number;
    details: RealtyDetailsEntity;
    investmentDetails: InvestmentDetailsEntity;
    images?: RealtyImagesEntity[];
}
