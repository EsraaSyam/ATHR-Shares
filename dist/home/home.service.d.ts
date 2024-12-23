import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/user.service';
import { BannerEntity } from './banner.entity';
import { Repository } from 'typeorm';
export declare class HomeService {
    private bannersRepository;
    private readonly usersService;
    private readonly authService;
    constructor(bannersRepository: Repository<BannerEntity>, usersService: UsersService, authService: AuthService);
    getBannerImages(): Promise<BannerEntity[]>;
    saveBannerImageUrl(imageUrl: string): Promise<void>;
    deleteBanner(id: number): Promise<import("typeorm").DeleteResult>;
}
