import { Module } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentPaymentDetailsEntity } from './investment-details.entity';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { RealtyModule } from 'src/realty/realty.module';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { UsersService } from 'src/users/user.service';
import { UsersModule } from 'src/users/user.module';
import { UserEntity } from 'src/users/user.entity';

@Module({
  providers: [InvestmentService, UsersService],
  controllers: [InvestmentController],
  imports: [
    TypeOrmModule.forFeature([InvestmentPaymentDetailsEntity, PaymentEntity, RealtyEntity, UserEntity]),
    PaymentModule,
    RealtyModule,
    UsersModule
  ],
})
export class InvestmentModule {}
