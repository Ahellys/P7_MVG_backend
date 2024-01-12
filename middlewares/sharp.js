const sharp = require('sharp');
const fs = require('fs');


const resize =(req, res, next) => {
    fs.access("./images", (error) => {
        if (error) {
          fs.mkdirSync("./images");
        }
    });
    const { buffer, originalname } = req.file;
    const ref = `${Date.now()}-${originalname}.webp`;
    sharp(buffer)
      .webp({ quality: 20 })
      .toFile("./uploads/" + ref);
    const link = `http://localhost:4000/${ref}`;
    res.json({ link });
}

module.exports = resize();