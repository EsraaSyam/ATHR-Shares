"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const common_1 = require("@nestjs/common");
const path = require("path");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        exceptionFactory: (errors) => {
            const errorMessages = errors.map(err => `${Object.values(err.constraints).join(', ')}`);
            return new common_1.BadRequestException({
                message: errorMessages.join('; '),
                statusCode: 400,
            });
        }
    }));
    app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix('api/v1');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map