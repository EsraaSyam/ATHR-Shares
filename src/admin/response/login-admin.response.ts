
export class loginAdminResponse {
    id: number;
    email: string;
    name: string;
    profile_photo: string;

    constructor(admin: any) {
        this.id = admin.id;
        this.email = admin.email;
        this.name = admin.name;
        this.profile_photo = admin.profile_image;
    }
}