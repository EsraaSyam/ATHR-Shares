import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, Res, UnauthorizedException, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/user.service';
import { HomeService } from './home.service';
import { Response } from 'express';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/common/utils/file-upload.util';
import bodyParser from 'body-parser';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
    async uploadFileAndSave(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }


        const fileUrl = `https://athrshares.com/uploads/home_baner/${file.filename}`;

        await this.homeService.saveBannerImageUrl(fileUrl, body.description);



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

    @Post('/upload-passport')
    @UseInterceptors(
        FilesInterceptor('images', 1, {
            storage: diskStorage({
                destination: './uploads/passport_images',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        }),
    )
    async uploadPassportImage(
        @Req() req,
        @UploadedFiles() file: Express.Multer.File, 
        @Res() res: Response,
    ) {
        const token = req.headers['authorization'];

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        const user = await this.AuthService.getUserByToken(token);

        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }

        if (!file) {
            return res.status(400).json({
                message: 'Please upload both front and back images',
            });
        }
        const fileUrls = `https://athrshares.com/uploads/passport_images/${file.filename}`;
        await this.homeService.uploadPassport(
            user,
            fileUrls,
        );

        return res.status(200).json({
            message: 'Profile images uploaded successfully!',
            fileUrls,
        });
    }

    @Post('/upload-id-images')
    @UseInterceptors(
        FilesInterceptor('images', 2, {
            storage: diskStorage({
                destination: './uploads/id_images',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        }),
    )
    async uploadIdImages(
        @Req() req,
        @UploadedFiles() files: Express.Multer.File[], 
        @Res() res: Response,
    ) {
        const token = req.headers['authorization'];

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        const user = await this.AuthService.getUserByToken(token);

        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }

        if (!files || files.length !== 2) {
            return res.status(400).json({
                message: 'Please upload both front and back images',
            });
        }
        const fileUrls = files.map(
            (file) => `https://athrshares.com/uploads/id_images/${file.filename}`,
        );
        await this.homeService.uploadIdPhotos(
            user,
            fileUrls,
        );

        return res.status(200).json({
            message: 'Profile images uploaded successfully!',
            fileUrls,
        });
    }




}
