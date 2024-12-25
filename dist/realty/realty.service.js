"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const realty_entity_1 = require("./entities/realty.entity");
const realty_response_1 = require("./responses/realty.response");
const realty_details_entity_1 = require("./entities/realty_details.entity");
const investment_details_entity_1 = require("./entities/investment-details.entity");
const realty_images_entity_1 = require("./entities/realty-images.entity");
const realty_background_entity_1 = require("./entities/realty-background.entity");
let RealtyService = class RealtyService {
    constructor(realtysRepository, realtyDetailsRepository, realtyImagesRepository) {
        this.realtysRepository = realtysRepository;
        this.realtyDetailsRepository = realtyDetailsRepository;
        this.realtyImagesRepository = realtyImagesRepository;
    }
    async findAll() {
        return this.realtysRepository.find({
            relations: ['details', 'investmentDetails', 'images'],
        });
    }
    async findRealtyById(id) {
        const realty = this.realtysRepository.findOne({ where: { id }, relations: ['details', 'investmentDetails', 'images'] });
        if (!realty) {
            throw new common_1.NotFoundException(`Realty of id ${id} does not exist`);
        }
        return realty;
    }
    async createRealty(createRealtyRequest, files, backgroundImageUrl) {
        const { details, investment_details, images, ...realtyData } = createRealtyRequest;
        if (Array.isArray(details.features)) {
            details.features = JSON.stringify(details.features);
        }
        else if (typeof details.features === 'string') {
            details.features = JSON.stringify(details.features.split(',').map(item => item.trim()));
        }
        const realtyDetails = new realty_details_entity_1.RealtyDetailsEntity();
        Object.assign(realtyDetails, details);
        const realtyInvestmentDetails = new investment_details_entity_1.InvestmentDetailsEntity();
        Object.assign(realtyInvestmentDetails, investment_details);
        const realtyBackground = new realty_background_entity_1.RealtyBackgroundEntity();
        if (backgroundImageUrl) {
            realtyBackground.image_url = backgroundImageUrl;
        }
        const realty = new realty_entity_1.RealtyEntity();
        Object.assign(realty, realtyData);
        realty.details = realtyDetails;
        realty.investmentDetails = realtyInvestmentDetails;
        realty.background_image = realtyBackground;
        const savedRealty = await this.realtysRepository.save(realty);
        if (files && files.length > 0) {
            const realtyImages = files.map((file, index) => {
                const realtyImage = new realty_images_entity_1.RealtyImagesEntity();
                realtyImage.image_url = file.path;
                realtyImage.description = images ? images[index]?.description : null;
                realtyImage.realty = savedRealty;
                return realtyImage;
            });
            await this.realtyImagesRepository.save(realtyImages);
        }
        return savedRealty;
    }
    async getAvaliableRealty() {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: true, is_active: true }, relations: ['details', 'investmentDetails', 'images'] });
        if (!realtys || realtys.length === 0) {
            throw new common_1.NotFoundException('لا توجد عقارات متاحة');
        }
        return realtys.map((realty) => new realty_response_1.RealtyResponse(realty));
    }
    async getSoldRealty() {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: false, is_active: true }, relations: ['details', 'investmentDetails', 'images'] });
        if (!realtys || realtys.length === 0) {
            throw new common_1.NotFoundException('لا توجد عقارات متاحة');
        }
        return realtys.map((realty) => new realty_response_1.RealtyResponse(realty));
    }
    async deleteRealty(id) {
        const realty = await this.realtysRepository.findOne({ where: { id } });
        if (!realty) {
            throw new common_1.NotFoundException(`العقار ذو المعرف ${id} غير موجود`);
        }
        return await this.realtysRepository.delete(id);
    }
};
exports.RealtyService = RealtyService;
exports.RealtyService = RealtyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(realty_entity_1.RealtyEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(realty_details_entity_1.RealtyDetailsEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(realty_images_entity_1.RealtyImagesEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RealtyService);
//# sourceMappingURL=realty.service.js.map