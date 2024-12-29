import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/user.service';
import { BannerEntity } from './banner.entity';
import { Repository } from 'typeorm';
import { TokenNotValid } from 'src/exceptions/token-not-valid.exception';

@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(BannerEntity)
        private bannersRepository: Repository<BannerEntity>,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }


    async getBannerImages() {
        return await this.bannersRepository.find({ where: { is_active: true } });
    }

    async saveBannerImageUrl(imageUrl: string, description: string) {
        const banner = new BannerEntity();
        banner.image_url = imageUrl;
        banner.description = description || '';

        await this.bannersRepository.save(banner);
    }

    async completeProfile(user: any, imageUrl: string[], is_passport: boolean) {
        if (user.passport_photo !== null || user.id_photo !== null) {
            throw new TokenNotValid('User already completed profile');
        }

        if (!is_passport) {
            user.id_photo = imageUrl;
        }

        if (is_passport) {
            user.passport_photo = imageUrl;
        }

        return await this.usersService.updateById(user.id, user);
    }

    async deleteBanner(id: number) {
        return await this.bannersRepository.delete(id);
    }

}
