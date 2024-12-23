import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter;

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

    async sendResetPasswordCode(email: string, resetCode: string) {
        const text = `HI, Your reset code is ${resetCode}`;
        try {
            await this.transporter.sendMail({
                to: email,
                subject: 'Password Reset Code',
                template: './reset-password',
                text,
            });

        } catch (error) {
            console.error('Error sending reset password email:', error);
            throw new Error('Error sending reset password email');
        }
    }
  
}
