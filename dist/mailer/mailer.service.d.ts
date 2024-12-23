export declare class MailerService {
    private transporter;
    constructor();
    sendResetPasswordCode(email: string, resetCode: string): Promise<void>;
}
