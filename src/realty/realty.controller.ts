import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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

@Controller('realty')
@UseGuards(RolesGuard)
export class RealtyController {
    constructor(private readonly realtyService: RealtyService) { }

    @Get()
    async getAllRealtys() {
        return this.realtyService.findAll();
    }

    @Get('get-realty-by-id/:id')
    async getRealtyById(@Param('id') id: number) {
        return this.realtyService.findRealtyById(id);
    }


    @Post('/create')
    @Roles(Role.ADMIN)
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

            const backgroundImageFile = files[0];
            const realtyImages = files.slice(1);

            const realtyImageUrls = realtyImages.map(file => `https://athrshares.com/uploads/realty_images/${file.filename}`);
            const backgroundImageUrl = backgroundImageFile
                ? `https://athrshares.com/uploads/realty_images/${backgroundImageFile.filename}`
                : null;


            const allImages = [backgroundImageFile, ...realtyImages];

            const realty = await this.realtyService.createRealty(createRealtyRequest, allImages, backgroundImageUrl);

            return res.status(201).json({
                message: 'Realty created successfully',
                data: {
                    ...realty,
                    images: realtyImageUrls,
                    background_image: backgroundImageUrl,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }


    @Get('/avaliable')
    async getAvaliableRealty(@Res() res: Response) {
        const realtys = await this.realtyService.getAvaliableRealty();
        return res.status(200).json(
            {
                data: {
                    realtys,
                }
            }
        );
    }

    @Get('/sold')
    async getSoldRealty(@Res() res: Response) {
        const realty = await this.realtyService.getSoldRealty();
        return res.status(200).json(
            {
                data: realty,
            }
        );
    }

    @Get('/home/avaliable_realty')
    async getHomeAvaliableRealty(@Res() res: Response) {
        const realtys = await this.realtyService.getHomeAvaliableRealty();
        return res.status(200).json(
            {
                data: {
                    realtys,
                }
            }
        );
    }

    @Delete('/delete/:id')
    @Roles(Role.ADMIN)
    async deleteRealty(@Param('id') id: number, @Res() res: Response) {
        await this.realtyService.deleteRealty(id);
        return res.status(200).json(
            {
                message: 'Realty deleted successfully',
            }
        );
    }
}
