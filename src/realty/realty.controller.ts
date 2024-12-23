import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { RealtyService } from './realty.service';
import { CreateRealtyRequest } from './requests/create-realty.request';
import { Response } from 'express';

@Controller('realty')
export class RealtyController {
    constructor(private readonly realtyService: RealtyService){}

    @Get()
    async getAllRealtys() {
        return this.realtyService.findAll();
    }

    @Get('get-realty-by-id/:id')
    async getRealtyById(@Param('id') id: number) {
        return this.realtyService.findRealtyById(id);
    }


    @Post('/create-realty')
    async createRealty(@Body() createRealtyRequest: CreateRealtyRequest, @Res() res: Response){
        const realty = await this.realtyService.createRealty(createRealtyRequest);
        return res.status(201).json(
            {
                message: 'Realty created successfully',
                data: realty,
            }
        );
    }

    @Get('/avaliable-realtys')
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

    @Get('/get-sold-realty')
    async getSoldRealty(@Res() res: Response) {
        const realty = await this.realtyService.getSoldRealty();
        return res.status(200).json(
            {
                data: realty,
            }
        );
    }

    @Delete('/delete-realty/:id')
    async deleteRealty(@Param('id') id: number, @Res() res: Response) {
        await this.realtyService.deleteRealty(id);
        return res.status(200).json(
            {
                message: 'Realty deleted successfully',
            }
        );
    }
}
