"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(user) {
        this.id = user.id;
        this.full_name = user.full_name;
        const nameParts = user.full_name.split(' ');
        this.first_name = nameParts[0];
        this.last_name = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
        this.email = user.email;
        this.phone_number = user.phone_number;
        this.is_completed = user.passport_photo !== null || user.id_photo !== null;
    }
}
exports.User = User;
//# sourceMappingURL=user.response.js.map