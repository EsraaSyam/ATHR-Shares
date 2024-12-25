import { Repository } from 'typeorm';
import { RealtyEntity } from './entities/realty.entity';
import { CreateRealtyRequest } from './requests/create-realty.request';
import { RealtyResponse } from './responses/realty.response';
import { RealtyDetailsEntity } from './entities/realty_details.entity';
import { RealtyImagesEntity } from './entities/realty-images.entity';
export declare class RealtyService {
    private realtysRepository;
    private realtyDetailsRepository;
    private readonly realtyImagesRepository;
    constructor(realtysRepository: Repository<RealtyEntity>, realtyDetailsRepository: Repository<RealtyDetailsEntity>, realtyImagesRepository: Repository<RealtyImagesEntity>);
    findAll(): Promise<RealtyEntity[]>;
    findRealtyById(id: number): Promise<RealtyEntity>;
    createRealty(createRealtyRequest: CreateRealtyRequest, files: Express.Multer.File[], backgroundImageUrl: string): Promise<RealtyEntity>;
    getAvaliableRealty(): Promise<RealtyResponse[]>;
    getSoldRealty(): Promise<RealtyResponse[]>;
    deleteRealty(id: number): Promise<import("typeorm").DeleteResult>;
}
