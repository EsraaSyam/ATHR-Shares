"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenNotValid = void 0;
const common_1 = require("@nestjs/common");
class TokenNotValid extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.TokenNotValid = TokenNotValid;
//# sourceMappingURL=token-not-valid.exception.js.map