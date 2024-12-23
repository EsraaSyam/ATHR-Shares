import { CreateRealtyDetailsRequest } from './create-realty_details.request';
export declare class CreateRealtyRequest {
    background_image: string;
    title: string;
    owner_name: string;
    net_quarter?: number;
    net_return?: number;
    down_payment?: number;
    is_avaliable: boolean;
    is_active: boolean;
    details: CreateRealtyDetailsRequest;
}
