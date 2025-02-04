import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('notifications')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) { }

    @Post('send')
    @UseInterceptors(AnyFilesInterceptor())
    async sendNotification(
        @Body('token') token: string,
        @Body('title') title: string,
        @Body('body') body: string,
    ) {
        return this.firebaseService.sendNotification(token, title, body);
    }
}
