import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, Res, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/user.service';
import { HomeService } from './home.service';
import { Response } from 'express';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/common/utils/file-upload.util';
import bodyParser from 'body-parser';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/auth/responses/user.response';
import { Role } from 'src/users/enums/user.enum';

@Controller('home')
export class HomeController {
    constructor(
        private readonly UsersService: UsersService,
        private readonly AuthService: AuthService,
        private readonly homeService: HomeService,
    ) {}

    @Get('/banners')
    async getBannerImages(@Res() res: Response) {
        const banners = await this.homeService.getBannerImages();

        return res.status(200).json({
            data: banners,
        });
    }

    @Post('/upload-and-save')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions))
    async uploadFileAndSave(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        if (!file) {
            return res.status(400).json({ message: 'لم يتم رفع أي ملف' });
        }

        const fileUrl = `/uploads/home_baner/${file.filename}`;
        await this.homeService.saveBannerImageUrl(fileUrl, body.description);

        return res.status(200).json({ message: 'تم رفع الملف وحفظ الرابط بنجاح!', fileUrl });
    }

    @Delete('/delete-banner')
    async deleteBanner(@Req() req, @Res() res: Response) {
        const id = req.body.id;
        await this.homeService.deleteBanner(id);

        return res.status(200).json({
            message: 'تم حذف البانر بنجاح',
        });
    }

    @Post('/upload')
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
    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    async uploadIdImages(
        @Body() body,
        @Req() req,
        @UploadedFiles() files: Express.Multer.File[], 
        @Res() res: Response,
    ) {
        const user = req.user;

        if (!body.multi) {
            return res.status(400).json({
                message: 'يرجي تحديد نوع تأكيد الهويه',
            });
        }

        const type = JSON.parse(body.multi);

        if (!user) {
            throw new UnauthorizedException('الرمز المميز غير صالح');
        }

        if(!files) {
            return res.status(400).json({
                message: 'يرجي رفع صوره تأكيد الهويه',
            });
        }

        let fileUrls = files.map(
            (file) => `/uploads/id_images/${file.filename}`,
        );

        if (files.length == 2 && type) {
            await this.homeService.uploadIdPhotos(user.sub, fileUrls);
        } else if (files.length == 1 && !type) {
            await this.homeService.uploadPassport(user.sub, fileUrls[0]);
        } else {
            return res.status(400).json({
                message: 'يوجد خطأ في رفع الصور',
            });
        }

        fileUrls = files.map(
            (file) => `${process.env.SERVER_URL}/uploads/id_images/${file.filename}`,
        );

        return res.status(200).json({
            message:  'تم التأكيد من صحة الهوية',
            fileUrls,
        });
    }
}
