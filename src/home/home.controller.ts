import { Controller, Delete, Get, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/user.service';
import { HomeService } from './home.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/common/utils/file-upload.util';

@Controller('home')
export class HomeController {
    constructor(
        private readonly UsersService: UsersService,
        private readonly AuthService: AuthService,
        private readonly homeService: HomeService,
    ) { }



    @Get('/banners')
    async getBannerImages(@Res() res: Response) {
        const banners = await this.homeService.getBannerImages();

        return res.status(200).json(
            {
                data: banners,
            }
        );
    }

    @Post('/upload-and-save')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions))
    async uploadFileAndSave(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `http://localhost:${process.env.PORT}/uploads/images/${file.filename}`;

        await this.homeService.saveBannerImageUrl(fileUrl);

        return res.status(200).json({ message: 'File uploaded and URL saved successfully!', fileUrl });
    }


    @Delete('/delete-banner')
    async deleteBanner(@Req() req, @Res() res: Response) {
        const id = req.body.id;
        await this.homeService.deleteBanner(id);

        return res.status(200).json(
            {
                message: 'Banner deleted successfully',
            }
        );
    }


}
