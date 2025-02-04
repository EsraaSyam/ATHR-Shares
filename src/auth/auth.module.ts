import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';
import { MailerService } from 'src/mailer/mailer.service';
import { TokenEntity } from './token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AdminEntity } from './entities/admin.entity';
import { DeviceEntity } from 'src/users/entities/device.entity';

@Module({
  imports:[
    JwtModule.register({
      secret: 'sira',
    }),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([TokenEntity, AdminEntity, DeviceEntity]),
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
  exports: [AuthService],
})

export class AuthModule {
  
}