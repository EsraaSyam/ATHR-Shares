import { diskStorage } from 'multer';
import { extname as getExtname } from 'path';

export const fileUploadOptions = {
    storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}${getExtname(file.originalname)}`;  
            cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|gif/;
        const fileExtname = getExtname(file.originalname).toLowerCase(); 
        const mimetype = allowedTypes.test(file.mimetype);

        if (allowedTypes.test(fileExtname) && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
};
