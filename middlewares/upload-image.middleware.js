const multer = require('multer');
const fs = require('fs');

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
        const type = ['image/png', 'image/jpeg'];
        if (type.indexOf(file.mimetype) < 0) {
            const error = new BadRequest('Image must be png or jpeg', 'image', 'invalid', 'Invalid image type');
            callback(error);
        }
        callback(null, file.fieldname + "-" + Date.now());
    }
});

const upload = multer({ storage: diskStorage }).single('image');

exports.uploadImage = (req, res, next) => {
    upload(req, res, (error) => {
        if (error) {
            next(error);
        }
        next();
    });
};