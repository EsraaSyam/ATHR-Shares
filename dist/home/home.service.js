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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../users/user.service");
const banner_entity_1 = require("./banner.entity");
const typeorm_2 = require("typeorm");
let HomeService = class HomeService {
    constructor(bannersRepository, usersService, authService) {
        this.bannersRepository = bannersRepository;
        this.usersService = usersService;
        this.authService = authService;
    }
    async getBannerImages() {
        return await this.bannersRepository.find({ where: { is_active: true } });
    }
    async saveBannerImageUrl(imageUrl, description) {
        const banner = new banner_entity_1.BannerEntity();
        banner.image_url = imageUrl;
        banner.description = description || '';
        await this.bannersRepository.save(banner);
    }
    async deleteBanner(id) {
        return await this.bannersRepository.delete(id);
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.BannerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UsersService,
        auth_service_1.AuthService])
], HomeService);
//# sourceMappingURL=home.service.js.map