import { RealtyDetailsResponss } from "./realty-details.response";
export declare class RealtyResponse {
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
    constructor(realty: any);
}
