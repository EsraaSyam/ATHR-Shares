import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { RealtyService } from './realty.service';
import { CreateRealtyRequest } from './requests/create-realty.request';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { fileUploadOptions } from 'src/common/utils/file-upload.util';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user.enum';
import { RealtyResponse } from './responses/realty.response';
import { UpdateRealtyRequest } from './requests/update-realty.request';

@Controller('realty')
@UseGuards(RolesGuard)
export class RealtyController {
    constructor(private readonly realtyService: RealtyService) { }

    @Get()
    async getAllRealtys() {
        return await this.realtyService.findAll();
    }

    @Get('get-realty-by-id/:id')
    async getRealtyById(@Param('id') id: number, @Res() res: Response) {
        const realty = await this.realtyService.findRealtyById(id); 

        return res.status(200).json({
            message: 'تم بنجاج',
            data: realty,
        });
    }



    @Post('/create')
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: './uploads/realty_images',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        })
    )
    async createRealty(
        @Body() createRealtyRequest: CreateRealtyRequest,
        @Req() req,
        @UploadedFiles() files: Express.Multer.File[],
        @Res() res,
    ) {
        try {

            if (!files) {
                return res.status(400).json({ message: 'Please upload at least one image' });
            }

            const backgroundImageFile = files[0];
            const realtyImages = files.slice(1);

            let realtyImageUrls = realtyImages.map(file => `/uploads/realty_images/${file.filename}`);
            let backgroundImageUrl = backgroundImageFile
                ? `/uploads/realty_images/${backgroundImageFile.filename}`
                : null;


            const allImages = [backgroundImageFile, ...realtyImages];

            realtyImageUrls = realtyImages.map(file => `${process.env.SERVER_URL}/uploads/realty_images/${file.filename}`);

            const realty = await this.realtyService.createRealty(createRealtyRequest, allImages, backgroundImageUrl);

            backgroundImageUrl = backgroundImageFile ? `${process.env.SERVER_URL}/uploads/background_images/${backgroundImageFile.filename}` : null;

            const data = new RealtyResponse(realty);

            return res.status(201).json({
                message: 'تم انشاء العقار بنجاح',
                data: {
                    ...data,
                    images: realtyImageUrls,
                    background_image: backgroundImageUrl,
                },
            });
        } catch (error) {
            return res.status(500).json({ message: 'حدث خطأ', error: error.message });
        }
    }


    @Get('/avaliable')
    async getAvaliableRealty(@Res() res: Response) {
        const realtys = await this.realtyService.getAvaliableRealty();
        return res.status(200).json(
            {
                message: 'تم بنجاح',
                data: realtys,
            }
        );
    }

    @Get('/sold')
    async getSoldRealty(@Res() res: Response) {
        const realty = await this.realtyService.getSoldRealty();
        return res.status(200).json(
            {
                message: 'تم بنجاح',
                data: realty,
            }
        );
    }

    @Get('/home/avaliable_realty')
    async getHomeAvaliableRealty(@Res() res: Response) {
        const realtys = await this.realtyService.getHomeAvaliableRealty();

        if (!realtys) {
            throw new NotFoundException('لا يوجد عقارات متوفرة');
        }

        return res.status(200).json(
            {
                message: 'تم بنجاح',
                data: realtys,
            }
        );
    }

    @Delete('/delete/:id')
    async deleteRealty(@Param('id') id: number, @Res() res: Response) {
        await this.realtyService.deleteRealty(Number(id));

        return res.status(200).json(
            {
                message: 'تم حذف العقار بنجاح',
            }
        );
    }

    @Put('/update/:id')
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: './uploads/realty_images',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        })
    )
    async updateRealty(
        @Param('id') id: number,
        @Body() updateRealtyRequest: UpdateRealtyRequest,
        @Req() req,
        @UploadedFiles() files: Express.Multer.File[],
        @Res() res: Response,
    ) {
        try {
            const realty = await this.realtyService.updateRealty(id, updateRealtyRequest, files);

            const realtyImages = files.map(file => `${process.env.SERVER_URL}/uploads/realty_images/${file.filename}`);

            return res.status(200).json({
                message: 'تم تحديث العقار بنجاح',
                data: {
                    ...realty,
                    images: realtyImages,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'حدث خطأ', error: error.message });
        }
    }

}
