"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadOptions = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
exports.fileUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads/images',
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}${(0, path_1.extname)(file.originalname)}`;
            cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|gif/;
        const fileExtname = (0, path_1.extname)(file.originalname).toLowerCase();
        const mimetype = allowedTypes.test(file.mimetype);
        if (allowedTypes.test(fileExtname) && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
};
//# sourceMappingURL=file-upload.util.js.map