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
import { UpdateRealtyRequest } from './requests/update-realty.request';

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
        const realtys =  await this.realtysRepository.find({
            relations: ['details', 'investmentDetails', 'images', 'priceDetails'],
            order: { id: 'DESC' }
        });

        if (!realtys) {
            throw new NotFoundException('لا توجد عقارات');
        }

        return realtys;
    }

    async findRealtyById(id: number) {
        const realtyData = await this.realtysRepository.findOne({ 
            where: { id, is_active: true }, 
            relations: ['details', 'investmentDetails', 'images', 'priceDetails'] 
        });

        if (!realtyData) {
            throw new NotFoundException(`لا يوجد عقار بالرقم ${id}`);
        }

        realtyData.details.features = JSON.parse(realtyData.details.features).join(", ");

        return realtyData;
    }

    async findRealtyByIdForInvestment(id: number){
        const realty = await this.realtysRepository.findOne({ 
            where: { id, is_active: true, is_avaliable: true }, 
            relations: ['details', 'investmentDetails'] 
        });

        if (!realty) {
            throw new NotFoundException(`لا يوجد عقار متاحه بالرقم ${id}`);
        }

        return realty;
    }

    async createRealty(createRealtyRequest: CreateRealtyRequest, files: Express.Multer.File[], backgroundImageUrl: string) {
        let { details, investment_details, images, ...realtyData } = createRealtyRequest;
       
        if (typeof details === 'string') {
            details = JSON.parse(details);
        }

        if (typeof investment_details === 'string') {
            investment_details = JSON.parse(investment_details);
        }

        if (typeof details.features === 'string') {
            details.features = JSON.stringify(details.features.split(',').map(item => item.trim()));
        }

        const realtyDetails = new RealtyDetailsEntity();
        Object.assign(realtyDetails, details);

        const realtyInvestmentDetails = new InvestmentDetailsEntity();
        Object.assign(realtyInvestmentDetails, investment_details);

        realtyInvestmentDetails.unit_price = details.price;

        const realtyBackground = new RealtyBackgroundEntity();
        if (backgroundImageUrl) {
            realtyBackground.image_url = backgroundImageUrl;
        }

        const realty = new RealtyEntity();
        Object.assign(realty, realtyData);
        realty.details = realtyDetails;
        realty.investmentDetails = realtyInvestmentDetails;
        realty.background_image = realtyBackground;
        realty.investmentDetails.service_charge = investment_details.service_charge;

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
    

    async updateRealty(id: number, updateRealtyRequest: UpdateRealtyRequest, files: Express.Multer.File[], backgroundImageUrl?: string) {
        const realty = await this.realtysRepository.findOne({
            where: { id },
            relations: ['details', 'investmentDetails', 'images'],
        });
    
        if (!realty) {
            throw new NotFoundException(`Realty with id ${id} not found`);
        }
    
        let { details, investment_details, images, ...realtyData } = updateRealtyRequest;
    
        details = details ? (typeof details === 'string' ? JSON.parse(details) : details) : realty.details;
        investment_details = investment_details
            ? typeof investment_details === 'string'
                ? JSON.parse(investment_details)
                : investment_details
            : realty.investmentDetails;
    
        if (details.features && typeof details.features === 'string') {
            details.features = JSON.stringify(details.features.split(',').map(item => item.trim()));
        }
    
        const parseOrDefault = (value: any, defaultValue: number = 0) => (value === '' || value === undefined ? defaultValue : Number(value));
    
        details.price = parseOrDefault(details.price);
        realtyData.net_quarter = parseOrDefault(realtyData.net_quarter);
        realtyData.net_return = parseOrDefault(realtyData.net_return);
        
        if (realtyData.sale_date !== undefined && realtyData.sale_date !== '') {
            var formatDate = new Date(realtyData.sale_date);
        }

        investment_details.service_charge = parseOrDefault(investment_details.service_charge);
    
        const realtyDetails = Object.assign(new RealtyDetailsEntity(), realty.details, details);
        realty.details = realtyDetails;
    
        const realtyInvestmentDetails = Object.assign(new InvestmentDetailsEntity(), realty.investmentDetails, investment_details);
        realtyInvestmentDetails.unit_price = details.price ?? realtyInvestmentDetails.unit_price;
        realtyInvestmentDetails.service_charge = investment_details.service_charge ?? realtyInvestmentDetails.service_charge;
        realty.investmentDetails = realtyInvestmentDetails;
    
        if (backgroundImageUrl) {
            realty.background_image.image_url = backgroundImageUrl;
        }

        if (formatDate instanceof Date && !isNaN(formatDate.getTime())) {
            realtyData.sale_date = formatDate.toISOString().split("T")[0]; 
        }

        console.log("realtyData", realtyData);

        if (realtyData.sale_date === '') {
            realtyData.sale_date = null;
        }
    
        Object.assign(realty, realtyData);
    
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
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: true, is_active: true }, relations: ['details', 'investmentDetails', 'images'] });

        if (!realtys || realtys.length === 0) {
            throw new NotFoundException('لا توجد عقارات متاحة');
        }

        return realtys.map((realty) => ({
            title: realty.title,
            owner_name: realty.owner_name,
            down_payment: realty.investmentDetails.down_payment,
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

        realty.is_active = false;

        return await this.realtysRepository.save(realty);
    }


}
