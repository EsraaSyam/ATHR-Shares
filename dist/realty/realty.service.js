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
let RealtyService = class RealtyService {
    constructor(realtysRepository, realtyDetailsRepository) {
        this.realtysRepository = realtysRepository;
        this.realtyDetailsRepository = realtyDetailsRepository;
    }
    async findAll() {
        return this.realtysRepository.find({
            relations: ['details']
        });
    }
    async findRealtyById(id) {
        const realty = this.realtysRepository.findOne({ where: { id }, relations: ['details'] });
        if (!realty) {
            throw new common_1.NotFoundException(`Realty of id ${id} does not exist`);
        }
        return realty;
    }
    async createRealty(createRealtyRequest) {
        const { details, ...realtyData } = createRealtyRequest;
        const realtyDetails = new realty_details_entity_1.RealtyDetailsEntity();
        Object.assign(realtyDetails, details);
        const realty = new realty_entity_1.RealtyEntity();
        Object.assign(realty, realtyData);
        realty.details = realtyDetails;
        const result = await this.realtysRepository.save(realty);
        return result;
    }
    async getAvaliableRealty() {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: true, is_active: true }, relations: ['details'] });
        if (!realtys || realtys.length === 0) {
            throw new common_1.NotFoundException('لا توجد عقارات متاحة');
        }
        return realtys.map((realty) => new realty_response_1.RealtyResponse(realty));
    }
    async getSoldRealty() {
        const realtys = await this.realtysRepository.find({ where: { is_avaliable: false, is_active: true }, relations: ['details'] });
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RealtyService);
//# sourceMappingURL=realty.service.js.map