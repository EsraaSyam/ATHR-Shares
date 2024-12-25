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
exports.HomeController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../users/user.service");
const home_service_1 = require("./home.service");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_util_1 = require("../common/utils/file-upload.util");
let HomeController = class HomeController {
    constructor(UsersService, AuthService, homeService) {
        this.UsersService = UsersService;
        this.AuthService = AuthService;
        this.homeService = homeService;
    }
    async getBannerImages(res) {
        const banners = await this.homeService.getBannerImages();
        return res.status(200).json({
            data: banners,
        });
    }
    async uploadFileAndSave(body, file, res) {
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = `http://localhost:${process.env.PORT}/uploads/images/${file.filename}`;
        await this.homeService.saveBannerImageUrl(fileUrl, body.description);
        return res.status(200).json({ message: 'File uploaded and URL saved successfully!', fileUrl });
    }
    async deleteBanner(req, res) {
        const id = req.body.id;
        await this.homeService.deleteBanner(id);
        return res.status(200).json({
            message: 'Banner deleted successfully',
        });
    }
};
exports.HomeController = HomeController;
__decorate([
    (0, common_1.Get)('/banners'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getBannerImages", null);
__decorate([
    (0, common_1.Post)('/upload-and-save'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', file_upload_util_1.fileUploadOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "uploadFileAndSave", null);
__decorate([
    (0, common_1.Delete)('/delete-banner'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "deleteBanner", null);
exports.HomeController = HomeController = __decorate([
    (0, common_1.Controller)('home'),
    __metadata("design:paramtypes", [user_service_1.UsersService,
        auth_service_1.AuthService,
        home_service_1.HomeService])
], HomeController);
//# sourceMappingURL=home.controller.js.map