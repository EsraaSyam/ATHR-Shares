"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./users/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./users/user.entity");
const auth_module_1 = require("./auth/auth.module");
const mailer_service_1 = require("./mailer/mailer.service");
const redis_service_1 = require("./config/redis.service");
const home_module_1 = require("./home/home.module");
const banner_entity_1 = require("./home/banner.entity");
const realty_module_1 = require("./realty/realty.module");
const realty_entity_1 = require("./realty/entities/realty.entity");
const realty_details_entity_1 = require("./realty/entities/realty_details.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [user_entity_1.UserEntity, banner_entity_1.BannerEntity, realty_entity_1.RealtyEntity, realty_details_entity_1.RealtyDetailsEntity],
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            user_module_1.UsersModule,
            auth_module_1.AuthModule,
            home_module_1.HomeModule,
            realty_module_1.RealtyModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, mailer_service_1.MailerService, redis_service_1.RedisService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map