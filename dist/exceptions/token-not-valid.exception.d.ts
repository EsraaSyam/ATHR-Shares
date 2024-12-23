import { HttpException } from '@nestjs/common';
export declare class TokenNotValid extends HttpException {
    constructor(message: string);
}
