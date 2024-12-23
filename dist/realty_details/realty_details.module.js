"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtyDetailsModule = void 0;
const common_1 = require("@nestjs/common");
const realty_details_controller_1 = require("./realty_details.controller");
const realty_details_service_1 = require("./realty_details.service");
let RealtyDetailsModule = class RealtyDetailsModule {
};
exports.RealtyDetailsModule = RealtyDetailsModule;
exports.RealtyDetailsModule = RealtyDetailsModule = __decorate([
    (0, common_1.Module)({
        controllers: [realty_details_controller_1.RealtyDetailsController],
        providers: [realty_details_service_1.RealtyDetailsService]
    })
], RealtyDetailsModule);
//# sourceMappingURL=realty_details.module.js.map