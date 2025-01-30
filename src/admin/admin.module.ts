import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../auth/entities/admin.entity';
import { InvestmentModule } from 'src/investment/investment.module';
import { PaymentModule } from 'src/payment/payment.module';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { RealtyModule } from 'src/realty/realty.module';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { PaymentMethodsEntity } from './entities/payment-methods.entity';
import { SocialMediaEntity } from './entities/social-media.entitiy';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { DeviceEntity } from 'src/users/entities/device.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    InvestmentModule,
    PaymentModule,
    RealtyModule,
    FirebaseModule,
    TypeOrmModule.forFeature([UserEntity, AdminEntity, PaymentEntity, RealtyEntity, PaymentMethodsEntity, SocialMediaEntity, DeviceEntity])
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
