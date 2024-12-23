"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtyResponse = void 0;
const realty_details_response_1 = require("./realty-details.response");
class RealtyResponse {
    constructor(realty) {
        this.id = realty.id;
        this.background_image = realty.background_image;
        this.title = realty.title;
        this.owner_name = realty.owner_name;
        this.is_avaliable = realty.is_avaliable;
        this.is_active = realty.is_active;
        this.user_id = realty.user_id;
        if (realty.is_avaliable) {
            this.down_payment = realty.down_payment;
        }
        else {
            this.net_quarter = realty.net_quarter;
            this.sale_date = realty.sale_date;
            this.net_return = realty.net_return;
        }
        this.details = realty.details ? new realty_details_response_1.RealtyDetailsResponss(realty.details) : null;
    }
}
exports.RealtyResponse = RealtyResponse;
//# sourceMappingURL=realty.response.js.map