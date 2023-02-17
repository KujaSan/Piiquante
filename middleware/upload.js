const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './file-upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: function (req, file, cb) {
        const fileTypes = /png|jpeg|jpg/;
        const extName = fileTypes.test(path.extname(file.originalname));
        file.originalname.toLowerCase();
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb("Error: only png, jpeg, and jpg are allowed!");
        }
    },
});


module.exports = upload.single('image');