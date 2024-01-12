const multer = require('multer');
const SharpMulter = require('sharp-multer');



/* const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
}); */

const storage =  SharpMulter ({
  destination:(req, file, callback) => {
    callback(null, "images")
  },
  imageOptions:{
    fileFormat: "webp",
    quality: 80,
    resize: { width: 400, height: 400 }
  },
  filename: (originalname) => {
      const name = originalname.split(' ').join('_');
      const extension = "webp";
      const newName = name + Date.now() + '.' + extension;
      return newName;
  }
});

module.exports = multer({storage: storage}).single('image');