import { Module } from '@nestjs/common';
import { RealtyController } from './realty.controller';
import { RealtyService } from './realty.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtyEntity } from './entities/realty.entity';
import { RealtyDetailsEntity } from './entities/realty_details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealtyEntity, RealtyDetailsEntity]),],
  exports: [RealtyService],  
  controllers: [RealtyController],
  providers: [RealtyService]
})
export class RealtyModule {}
