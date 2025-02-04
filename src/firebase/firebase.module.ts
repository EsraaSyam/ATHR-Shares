import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import * as admin from 'firebase-admin';
import * as serviceAccount from 'src/config/firebase/google-services.json';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

const cleanedServiceAccount = {
  type: serviceAccount.type,
  project_id: serviceAccount.project_id,
  private_key_id: serviceAccount.private_key_id,
  private_key: serviceAccount.private_key,
  client_email: serviceAccount.client_email,
  client_id: serviceAccount.client_id,
  auth_uri: serviceAccount.auth_uri,
  token_uri: serviceAccount.token_uri,
  auth_provider_x509_cert_url: serviceAccount.auth_provider_x509_cert_url,
  client_x509_cert_url: serviceAccount.client_x509_cert_url
};

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        try {
          return admin.initializeApp({
            credential: admin.credential.cert(cleanedServiceAccount as admin.ServiceAccount),
          });
        } catch (error) {
          console.error('Failed to initialize Firebase Admin SDK:', error);
          throw error;
        }
      }
    },
    FirebaseService,
  ],
  exports: ['FIREBASE_ADMIN', FirebaseService],
  controllers: [FirebaseController],
})
export class FirebaseModule {}
