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
        return await this.bannersRepository.find({where: {is_active: true}});
    }

    async saveBannerImageUrl(imageUrl: string) {
        const banner = new BannerEntity();
        banner.image_url = imageUrl;
    
        await this.bannersRepository.save(banner); 
      }

    async deleteBanner(id: number) {
        return await this.bannersRepository.delete(id);
    }

}
