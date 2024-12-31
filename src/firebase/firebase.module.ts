import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import * as admin from 'firebase-admin';
import * as serviceAccount from 'src/config/firebase/google-services.json';

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
      },
    },
    FirebaseService,
  ],
  exports: ['FIREBASE_ADMIN'],
  controllers: [FirebaseController]
})
export class FirebaseModule {}
