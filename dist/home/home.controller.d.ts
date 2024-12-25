import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/user.service';
import { HomeService } from './home.service';
import { Response } from 'express';
export declare class HomeController {
    private readonly UsersService;
    private readonly AuthService;
    private readonly homeService;
    constructor(UsersService: UsersService, AuthService: AuthService, homeService: HomeService);
    getBannerImages(res: Response): Promise<Response<any, Record<string, any>>>;
    uploadFileAndSave(body: any, file: Express.Multer.File, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteBanner(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
