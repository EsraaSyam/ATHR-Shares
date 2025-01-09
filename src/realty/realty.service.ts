import { Body, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtyEntity } from './entities/realty.entity';
import { CreateRealtyRequest } from './requests/create-realty.request';
import { RealtyResponse } from './responses/realty.response';
import { RealtyDetailsEntity } from './entities/realty_details.entity';
import { InvestmentDetailsEntity } from './entities/investment-details.entity';
import { RealtyImagesEntity } from './entities/realty-images.entity';
import { RealtyBackgroundEntity } from './entities/realty-background.entity';
import { title } from 'process';

@Injectable()
export class RealtyService {
    constructor(
        @InjectRepository(RealtyEntity)
        private realtysRepository: Repository<RealtyEntity>,

        @InjectRepository(RealtyDetailsEntity)
        private realtyDetailsRepository: Repository<RealtyDetailsEntity>,

        @InjectRepository(RealtyImagesEntity)
        private readonly realtyImagesRepository: Repository<RealtyImagesEntity>
    ) { }

    async findAll() {
        return this.realtysRepository.find(
            {
                relations: ['details', 'investmentDetails', 'images', 'priceDetails'],
            }
        );
    }

    async findRealtyById(id: number) {
        const realty = this.realtysRepository.findOne({ where: { id }, relations: ['details', 'investmentDetails', 'images', 'priceDetails'] });

        if (!realty) {
            throw new NotFoundException(`Realty of id ${id} does not exist`);
        }

        return realty;
    }

    async createRealty(createRealtyRequest: CreateRealtyRequest, files: Express.Multer.File[], backgroundImageUrl: string) {
        const { details, investment_details, images, ...realtyData } = createRealtyRequest;
    
        if (Array.isArray(details.features)) {
            details.features = JSON.stringify(details.features);
        } else if (typeof details.features === 'string') {
            details.features = JSON.stringify(details.features.split(',').map(item => item.trim()));
        }
    
        const realtyDetails = new RealtyDetailsEntity();
        Object.assign(realtyDetails, details);
    
        const realtyInvestmentDetails = new InvestmentDetailsEntity();
        Object.assign(realtyInvestmentDetails, investment_details);
    
        const realtyBackground = new RealtyBackgroundEntity();
        if (backgroundImageUrl) {
            realtyBackground.image_url = backgroundImageUrl;
        }
    
        const realty = new RealtyEntity();
        Object.assign(realty, realtyData);
        realty.details = realtyDetails;
        realty.investmentDetails = realtyInvestmentDetails;
        realty.background_image = realtyBackground; 
        
        const savedRealty = await this.realtysRepository.save(realty);
    
        if (files && files.length > 0) {
            const realtyImages = files.map((file, index) => {
                const realtyImage = new RealtyImagesEntity();
                realtyImage.image_url = file.path;
                realtyImage.description = images ? images[index]?.description : null;
                realtyImage.realty = savedRealty;
                return realtyImage;
            });
            await this.realtyImagesRepository.save(realtyImages);
        }
    
        return savedRealty;
    }

    

    




    async getAvaliableRealty(): Promise<RealtyResponse[]> {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: true, is_active: true }, relations: ['details', 'investmentDetails', 'images'] });

        if (!realtys || realtys.length === 0) {
            throw new NotFoundException('لا توجد عقارات متاحة');
        }

        return realtys.map((realty) => new RealtyResponse(realty));
    }

    async getHomeAvaliableRealty() {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: true }, relations: ['details', 'investmentDetails', 'images'] });

        if (!realtys || realtys.length === 0) {
            throw new NotFoundException('لا توجد عقارات متاحة');
        }

        return realtys.map((realty) => ({
            title: realty.title,
            owner_name: realty.owner_name,
            down_payment: realty.down_payment,
            background_image: `${process.env.SERVER_URL}/${realty.images[0].image_url}`,
           
        }));
    }

    async getSoldRealty() {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: false, is_active: true }, relations: ['details', 'investmentDetails', 'images'] });

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
