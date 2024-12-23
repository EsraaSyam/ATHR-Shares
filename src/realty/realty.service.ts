import { Body, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtyEntity } from './entities/realty.entity';
import { CreateRealtyRequest } from './requests/create-realty.request';
import { RealtyResponse } from './responses/realty.response';
import { RealtyDetailsEntity } from './entities/realty_details.entity';
import { InvestmentDetailsEntity } from './entities/investment-details.entity';

@Injectable()
export class RealtyService {
    constructor(
        @InjectRepository(RealtyEntity)
        private realtysRepository: Repository<RealtyEntity>,

        @InjectRepository(RealtyDetailsEntity)
        private realtyDetailsRepository: Repository<RealtyDetailsEntity>,
    ) { }

    async findAll() {
        return this.realtysRepository.find(
            {
                relations: ['details', 'investmentDetails'],
            }
        );
    }

    async findRealtyById(id: number) {
        const realty =  this.realtysRepository.findOne({ where: { id } , relations: ['details', 'investmentDetails'] });

        if (!realty) {
            throw new NotFoundException(`Realty of id ${id} does not exist`);
        }

        return realty;
    }

    async createRealty(createRealtyRequest: CreateRealtyRequest) {
        const { details, investmentDetails, ...realtyData } = createRealtyRequest;

        const realtyDetails = new RealtyDetailsEntity();
        Object.assign(realtyDetails, details);

        const realtyInvestmentDetails = new InvestmentDetailsEntity();
        Object.assign(realtyInvestmentDetails, investmentDetails);

        const realty = new RealtyEntity();
        Object.assign(realty, realtyData);
        realty.details = realtyDetails;
        realty.investmentDetails = realtyInvestmentDetails;

        const result = await this.realtysRepository.save(realty);
        return result;
    }

    async getAvaliableRealty(): Promise<RealtyResponse[]> {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: true, is_active: true }, relations: ['details', 'investmentDetails'] });
    
        if (!realtys || realtys.length === 0) {
            throw new NotFoundException('لا توجد عقارات متاحة');
        }

        return realtys.map((realty) => new RealtyResponse(realty));
    }

    async getSoldRealty() {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: false, is_active: true }, relations: ['details', 'investmentDetails'] });
    
        if (!realtys || realtys.length === 0) {
            throw new NotFoundException('لا توجد عقارات متاحة');
        }
        
        return realtys.map((realty) => new RealtyResponse(realty));
    }

    async deleteRealty(id: number) {
        const realty = await this.realtysRepository.findOne({ where: { id } });
        if (!realty) {
            throw new NotFoundException(`العقار ذو المعرف ${id} غير موجود`);
        }

        return await this.realtysRepository.delete(id);
    }


}
