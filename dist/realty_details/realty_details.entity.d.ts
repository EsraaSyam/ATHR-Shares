import { RealtyEntity } from "src/realty/entities/realty.entity";
export declare class RealtyDetailsEntity {
    id: number;
    title: string;
    bathroom_count: number;
    room_count: number;
    area: number;
    type: string;
    price: number;
    features: string;
    longitude: string;
    latitude: string;
    realty: RealtyEntity;
}
