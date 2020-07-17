const multer = require('multer');

exports.uploadImage = (req, res, next) => {
    const file = req.files.image;
    res.json(req.files);
    /*
    if (file && (file.mimetype === "image/png" || file.mimetype === "image/jpeg")) {
        const diskStorage = multer.diskStorage({
            destination: './uploads',
            filename: `${Date.now()}`+`${file.name}`
        });
        multer({storage: diskStorage}).single('file');
        next();
    }
    else {
        res.status(400).json({message: 'Image must have correct format!'});
    }*/
};