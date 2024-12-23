"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtyModule = void 0;
const common_1 = require("@nestjs/common");
const realty_controller_1 = require("./realty.controller");
const realty_service_1 = require("./realty.service");
const typeorm_1 = require("@nestjs/typeorm");
const realty_entity_1 = require("./entities/realty.entity");
const realty_details_entity_1 = require("./entities/realty_details.entity");
const investment_details_entity_1 = require("./entities/investment-details.entity");
let RealtyModule = class RealtyModule {
};
exports.RealtyModule = RealtyModule;
exports.RealtyModule = RealtyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([realty_entity_1.RealtyEntity, realty_details_entity_1.RealtyDetailsEntity, investment_details_entity_1.InvestmentDetailsEntity])],
        exports: [realty_service_1.RealtyService],
        controllers: [realty_controller_1.RealtyController],
        providers: [realty_service_1.RealtyService]
    })
], RealtyModule);
//# sourceMappingURL=realty.module.js.map