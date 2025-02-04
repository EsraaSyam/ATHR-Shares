import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { DeviceEntity } from './entities/device.entity';
import { NotificationsEntity } from 'src/firebase/entites/notifications.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DeviceEntity, NotificationsEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
