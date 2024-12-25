import { Module } from '@nestjs/common';
import { RealtyController } from './realty.controller';
import { RealtyService } from './realty.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtyEntity } from './entities/realty.entity';
import { RealtyDetailsEntity } from './entities/realty_details.entity';
import { InvestmentDetailsEntity } from './entities/investment-details.entity';
import { RealtyImagesEntity } from './entities/realty-images.entity';
import { RealtyBackgroundEntity } from './entities/realty-background.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealtyEntity, RealtyDetailsEntity, InvestmentDetailsEntity, RealtyImagesEntity, RealtyBackgroundEntity])],
  exports: [RealtyService],  
  controllers: [RealtyController],
  providers: [RealtyService]
})
export class RealtyModule {}
