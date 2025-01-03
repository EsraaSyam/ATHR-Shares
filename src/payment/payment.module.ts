import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { PriceDetailsEntity } from './entities/price-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RealtyEntity, PriceDetailsEntity, PaymentEntity]
  ),
  UsersModule, AuthModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
