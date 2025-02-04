import { Controller, Get, Query, Render, Res } from '@nestjs/common';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';


@Controller('dashboard')
export class DashboardController {
    constructor(private readonly i18n: I18nService) { }
    @Get('/home')
    @Render('index')
    getDashboard() {
        return { title: 'Dashboard' };
    }

    @Get('/login')
    getLoginPage(@Res() res) {
        return res.render('login_one', { title: 'Login', layout: false });
    }

    @Get('/users')
    @Render('users')
    getUsersPage(@Res() res) {
        return { title: 'Users' };
    }

    @Get('/payment')
    @Render('payment')
    getRealtyPage(@Res() res) {
        return { title: 'Realty' };
    }

    @Get('/realty')
    @Render('realty')
    getRealtyDetailsPage(@Res() res) {
        return { title: 'Realty Details' };
    }


    @Get('/update-user')
    @Render('update-user')
    getUpdateUserPage(@Res() res) {
        return { title: 'Update User' };
    }

    @Get('/payment-more-info')
    @Render('payment-more-info')
    getUpdatePaymentPage(@Res() res) {
        return { title: 'payment-more-info' };
    }

    @Get('/update-realty')
    @Render('edit_realty')
    getUpdateRealtyPage(@Res() res) {
        return { title: 'Update Realty' };
    }

    @Get('/settings')
    @Render('settings')
    async getSettings(@I18n() i18n: I18nContext, @Query('lang') lang: string){
        const isRTL = lang === 'ar';
        return {
            title: await i18n.t('test.settings.title'),
            language_label: await i18n.t('test.settings.language_label'),
            save_button: await i18n.t('test.settings.save_button'),
            lang,
            isRTL,
        };
    }

    @Get('/payment-settings')
    @Render('payment_settings')
    getPaymentSettingsPage(@Res() res) {
        return { title: 'Payment Settings' };
    }

    @Get('/social')
    @Render('social')
    getSocialPage(@Res() res) {
        return { title: 'Social' };
    }

    @Get('/notifications')
    @Render('notifications')
    getNotificationsPage(@Res() res) {
        return { title: 'Notifications' };
    }

    @Get('/sold-realty')
    @Render('sold_realty')
    getSoldRealtyPage(@Res() res) {
        return { title: 'Sold Realty' };
    }

}
