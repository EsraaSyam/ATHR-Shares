"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtyResponse = void 0;
const investment_details_response_1 = require("./investment-details.response");
const realty_details_response_1 = require("./realty-details.response");
const realty_images_response_1 = require("./realty-images.response");
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
        this.investmentDetails = realty.investmentDetails ? new investment_details_response_1.InvestmentDetailsResponses(realty.investmentDetails) : null;
        this.realty_images = realty.images ? realty.images.map((image) => new realty_images_response_1.RealtyImagesResponse(image)) : [];
    }
}
exports.RealtyResponse = RealtyResponse;
//# sourceMappingURL=realty.response.js.map