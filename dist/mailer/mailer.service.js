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
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailerService = class MailerService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'kidcare2002@gmail.com',
                pass: 'pypt atcn bmgd jbgq',
            },
            defaults: {
                from: '"No Reply" <no-reply@example.com>',
            },
        });
    }
    async sendResetPasswordCode(email, resetCode, full_name) {
        const nameParts = full_name.split(' ');
        const text = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Password Reset Request</h2>
          <h3><p>Hi ${nameParts[0]},</p></h3>
          <h4><p>We received a request to reset your password. Here is your reset code:</p></h4>
          <div style="padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; text-align: center; font-size: 18px; font-weight: bold; color: #555;">
              ${resetCode}
          </div>
          <h4><p>Please use this code to reset your password. If you didn't request a password reset, you can safely ignore this email or contact our support team for assistance.</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p style="font-weight: bold;"> ATHR Support Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">
              If you have any questions, feel free to <a href="mailto:support@yourcompany.com" style="color: #4CAF50; text-decoration: none;">contact us</a>.
          </p></h4>
      </div>
  `;
        try {
            await this.transporter.sendMail({
                from: '"No Reply" <no-reply@example.com>',
                to: email,
                subject: 'Password Reset Code',
                template: './reset-password',
                html: text,
            });
        }
        catch (error) {
            console.error('Error sending reset password email:', error);
            throw new Error('Error sending reset password email');
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailerService);
//# sourceMappingURL=mailer.service.js.map