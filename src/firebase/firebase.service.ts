import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) { }

    async sendNotification(token: string, title: string, body: string) {
        const message = {
            notification: { title, body },
            token,
        };

        console.log(message);

        try {
            const response = await this.firebaseAdmin.messaging().send(message);
            console.log('Notification sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw new UnauthorizedException(error);
        }
    }
}
