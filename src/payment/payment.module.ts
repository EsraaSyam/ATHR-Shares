import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { PaymentDetailsEntity } from './entities/payment-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealtyEntity, PaymentDetailsEntity, PaymentEntity])],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
