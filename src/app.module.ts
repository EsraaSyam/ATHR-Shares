import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { MailerService } from './mailer/mailer.service';
import { HomeModule } from './home/home.module';
import { BannerEntity } from './home/banner.entity';
import { RealtyModule } from './realty/realty.module';
import { RealtyEntity } from './realty/entities/realty.entity';
import { RealtyDetailsEntity } from './realty/entities/realty_details.entity';
import { InvestmentDetailsEntity } from './realty/entities/investment-details.entity';
import { RealtyImagesEntity } from './realty/entities/realty-images.entity';
import { RealtyBackgroundEntity } from './realty/entities/realty-background.entity';
import { PaymentModule } from './payment/payment.module';
import { PriceDetailsEntity } from './payment/entities/price-details.entity';
import { FirebaseModule } from './firebase/firebase.module';
import { AdminModule } from './admin/admin.module';
import { PaymentEntity } from './payment/entities/payment.entity';
import { TokenEntity } from './auth/token.entity';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { InvestmentModule } from './investment/investment.module';
import { InvestmentPaymentDetailsEntity } from './investment/entities/investment-details.entity';
import { PaymentForInvestmentEntity } from './investment/entities/payment-investment.entity';
import { AdminEntity } from './auth/entities/admin.entity';
import { DashboardModule } from './dashboard/dashboard.module';
import { CookieResolver, HeaderResolver, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { I18nModule } from 'nestjs-i18n';
import { AcceptLanguageResolver } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    

    JwtModule.register({
      secret: 'sira',
    }),

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
        entities: [UserEntity, BannerEntity, RealtyEntity, RealtyDetailsEntity, InvestmentDetailsEntity, RealtyImagesEntity, RealtyBackgroundEntity,
          PriceDetailsEntity, PaymentEntity, TokenEntity,InvestmentPaymentDetailsEntity, PaymentForInvestmentEntity, AdminEntity,
        ],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false, 
        }
      }),

      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    HomeModule,
    RealtyModule,
    PaymentModule,
    FirebaseModule,
    AdminModule,
    InvestmentModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
