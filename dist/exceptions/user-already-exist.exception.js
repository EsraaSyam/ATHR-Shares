"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAlreadyExist = void 0;
const common_1 = require("@nestjs/common");
class UserAlreadyExist extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.UserAlreadyExist = UserAlreadyExist;
//# sourceMappingURL=user-already-exist.exception.js.map