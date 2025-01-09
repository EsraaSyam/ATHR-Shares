import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/user.service';
import { BannerEntity } from './banner.entity';
import { Repository } from 'typeorm';
import { TokenNotValid } from 'src/exceptions/token-not-valid.exception';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(BannerEntity)
        private bannersRepository: Repository<BannerEntity>,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async getBannerImages() {
        let banners =  await this.bannersRepository.find({ where: { is_active: true } });

        if (!banners || banners.length === 0) {
            throw new Error('لا توجد بنرات');
        }

        banners.forEach(banner => {
            banner.image_url = `${process.env.APP_URL}/${banner.image_url}`;
        })
    }

    async saveBannerImageUrl(imageUrl: string, description: string) {
        const banner = new BannerEntity();
        banner.image_url = imageUrl;
        banner.description = description || '';

        await this.bannersRepository.save(banner);
    }

    async uploadPassport(id: string, imageUrl: string) {
        const userData = await this.usersService.findByIdWithout(Number(id));
        // if (user.passport_photo !== null || user.id_photo_back !== null) {
        //     throw new TokenNotValid('تم إكمال الملف الشخصي بالفعل');
        // }

        userData.passport_photo = imageUrl;
        userData.is_completed = true;

        return await this.usersService.updateById(Number(userData.id), userData);
    }

    async uploadIdPhotos(id: string, image_url: string[]) {
        const userData = await this.usersService.findByIdWithout(Number(id));
        // if (user.passport_photo !== null || user.id_photo_back !== null) {
        //     throw new TokenNotValid('تم إكمال الملف الشخصي بالفعل');
        // }

        userData.id_photo_front = image_url[0];
        userData.id_photo_back = image_url[1];
        userData.is_completed = true;

        return await this.usersService.updateById(Number(userData.id), userData);
    }

    async deleteBanner(id: number) {
        return await this.bannersRepository.delete(id);
    }
}

