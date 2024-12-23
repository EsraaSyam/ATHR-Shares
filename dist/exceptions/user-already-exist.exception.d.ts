import { HttpException } from '@nestjs/common';
export declare class UserAlreadyExist extends HttpException {
    constructor(message: string);
}
