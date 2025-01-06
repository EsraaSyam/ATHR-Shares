import { Body, Controller, Get, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user.enum';
import { GetInvestmentPaymentDetailsRequest } from './requests/get-investment-payment-details.request';
import { Response } from 'express';

@UseGuards(RolesGuard)
@Controller('investment')
export class InvestmentController {
    constructor(private readonly investmentService: InvestmentService) { }

    @Get('details')
    @Roles(Role.USER)
    @UseInterceptors(AnyFilesInterceptor())
    async getInvestmentPaymentDetails(@Body() body: GetInvestmentPaymentDetailsRequest, @Req() req, @Res() res: Response) {
        
        return this.investmentService.getInvestmentPaymentDetails(body);
    }
}
