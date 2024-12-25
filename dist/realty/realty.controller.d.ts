import { RealtyService } from './realty.service';
import { CreateRealtyRequest } from './requests/create-realty.request';
import { Response } from 'express';
export declare class RealtyController {
    private readonly realtyService;
    constructor(realtyService: RealtyService);
    getAllRealtys(): Promise<import("./entities/realty.entity").RealtyEntity[]>;
    getRealtyById(id: number): Promise<import("./entities/realty.entity").RealtyEntity>;
    createRealty(createRealtyRequest: CreateRealtyRequest, files: Express.Multer.File[], res: any): Promise<any>;
    getAvaliableRealty(res: Response): Promise<Response<any, Record<string, any>>>;
    getSoldRealty(res: Response): Promise<Response<any, Record<string, any>>>;
    deleteRealty(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
