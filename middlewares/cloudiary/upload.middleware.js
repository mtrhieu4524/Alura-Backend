const multer = require('multer');
const storage = require('../../configs/cloudiary/cloudinaryStorage');

const upload = multer({ storage });

module.exports = upload;
