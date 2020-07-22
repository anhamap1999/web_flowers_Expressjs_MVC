const multer = require('multer');
const fs = require('fs');

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
        const type = ['image/png', 'image/jpeg'];
        if (type.indexOf(file.mimetype) < 0) {
            callback({ message: "Image must be png or jpeg" });
        }
        callback(null, file.fieldname + "-" + Date.now());
    }
});

const upload = multer({ storage: diskStorage }).single('image');

exports.uploadImage = (req, res, next) => {
    upload(req, res, (error) => {
        if (error) {
            res.status(500).json(error);
        }
        next();
    });
};