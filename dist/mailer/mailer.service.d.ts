export declare class MailerService {
    private transporter;
    constructor();
    sendResetPasswordCode(email: string, resetCode: string, full_name: string): Promise<void>;
}
