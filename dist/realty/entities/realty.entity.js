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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtyEntity = void 0;
const realty_details_entity_1 = require("./realty_details.entity");
const typeorm_1 = require("typeorm");
let RealtyEntity = class RealtyEntity {
};
exports.RealtyEntity = RealtyEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RealtyEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: true }),
    __metadata("design:type", Boolean)
], RealtyEntity.prototype, "is_avaliable", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: true }),
    __metadata("design:type", Boolean)
], RealtyEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RealtyEntity.prototype, "background_image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RealtyEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RealtyEntity.prototype, "owner_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], RealtyEntity.prototype, "net_quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], RealtyEntity.prototype, "sale_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], RealtyEntity.prototype, "net_return", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], RealtyEntity.prototype, "down_payment", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], RealtyEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => realty_details_entity_1.RealtyDetailsEntity, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", realty_details_entity_1.RealtyDetailsEntity)
], RealtyEntity.prototype, "details", void 0);
exports.RealtyEntity = RealtyEntity = __decorate([
    (0, typeorm_1.Entity)('realty')
], RealtyEntity);
//# sourceMappingURL=realty.entity.js.map