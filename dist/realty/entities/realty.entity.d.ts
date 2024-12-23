import { RealtyDetailsEntity } from "src/realty/entities/realty_details.entity";
export declare class RealtyEntity {
    id: number;
    is_avaliable?: boolean;
    is_active?: boolean;
    background_image: string;
    title: string;
    owner_name: string;
    net_quarter?: number;
    sale_date?: Date;
    net_return?: number;
    down_payment?: number;
    user_id?: number;
    details: RealtyDetailsEntity;
}
