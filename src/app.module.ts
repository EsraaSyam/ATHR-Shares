import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { MailerService } from './mailer/mailer.service';
import { RedisService } from './config/redis.service';
import { HomeModule } from './home/home.module';
import { BannerEntity } from './home/banner.entity';
import { RealtyModule } from './realty/realty.module';
import { RealtyEntity } from './realty/entities/realty.entity';
import { RealtyDetailsEntity } from './realty/entities/realty_details.entity';
import { InvestmentDetailsEntity } from './realty/entities/investment-details.entity';
import { RealtyImagesEntity } from './realty/entities/realty-images.entity';
import { RealtyBackgroundEntity } from './realty/entities/realty-background.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  
      envFilePath: '.env',  
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [UserEntity, BannerEntity, RealtyEntity, RealtyDetailsEntity, InvestmentDetailsEntity, RealtyImagesEntity, RealtyBackgroundEntity],
        synchronize: true,
      }),

      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    HomeModule,
    RealtyModule,
    ],
  controllers: [AppController],
  providers: [AppService, MailerService, RedisService],
})
export class AppModule {}
