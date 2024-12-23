import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { UsersModule } from 'src/users/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from './banner.entity';

@Module({
  imports: [UsersModule, AuthModule,
    TypeOrmModule.forFeature([BannerEntity]),
  ],
  exports: [HomeService],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
