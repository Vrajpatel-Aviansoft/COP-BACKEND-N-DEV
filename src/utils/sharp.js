const sharp = require("sharp");

// create function to compress multiple images
const compressImages = async (imageBuffers, quality = 100) => {
  return Promise.all(
    imageBuffers.map((imageBuffer) =>
      sharp(imageBuffer).webp({ quality }).toBuffer()
    )
  );
};

module.exports = { compressImages };
