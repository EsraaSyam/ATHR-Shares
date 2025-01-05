import { Module } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentPaymentDetailsEntity } from './investment-details.entity';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  providers: [InvestmentService],
  controllers: [InvestmentController],
  imports: [
    TypeOrmModule.forFeature([InvestmentPaymentDetailsEntity, PaymentEntity]),
    PaymentModule,
  ],
})
export class InvestmentModule {}
