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
exports.RealtyController = void 0;
const common_1 = require("@nestjs/common");
const realty_service_1 = require("./realty.service");
const create_realty_request_1 = require("./requests/create-realty.request");
let RealtyController = class RealtyController {
    constructor(realtyService) {
        this.realtyService = realtyService;
    }
    async getAllRealtys() {
        return this.realtyService.findAll();
    }
    async getRealtyById(id) {
        return this.realtyService.findRealtyById(id);
    }
    async createRealty(createRealtyRequest, res) {
        const realty = await this.realtyService.createRealty(createRealtyRequest);
        return res.status(201).json({
            message: 'Realty created successfully',
            data: realty,
        });
    }
    async getAvaliableRealty(res) {
        const realtys = await this.realtyService.getAvaliableRealty();
        return res.status(200).json({
            data: {
                realtys,
            }
        });
    }
    async getSoldRealty(res) {
        const realty = await this.realtyService.getSoldRealty();
        return res.status(200).json({
            data: realty,
        });
    }
    async deleteRealty(id, res) {
        await this.realtyService.deleteRealty(id);
        return res.status(200).json({
            message: 'Realty deleted successfully',
        });
    }
};
exports.RealtyController = RealtyController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealtyController.prototype, "getAllRealtys", null);
__decorate([
    (0, common_1.Get)('get-realty-by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RealtyController.prototype, "getRealtyById", null);
__decorate([
    (0, common_1.Post)('/create-realty'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_realty_request_1.CreateRealtyRequest, Object]),
    __metadata("design:returntype", Promise)
], RealtyController.prototype, "createRealty", null);
__decorate([
    (0, common_1.Get)('/avaliable-realtys'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RealtyController.prototype, "getAvaliableRealty", null);
__decorate([
    (0, common_1.Get)('/get-sold-realty'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RealtyController.prototype, "getSoldRealty", null);
__decorate([
    (0, common_1.Delete)('/delete-realty/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RealtyController.prototype, "deleteRealty", null);
exports.RealtyController = RealtyController = __decorate([
    (0, common_1.Controller)('realty'),
    __metadata("design:paramtypes", [realty_service_1.RealtyService])
], RealtyController);
//# sourceMappingURL=realty.controller.js.map