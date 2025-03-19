const { default: axios } = require('axios');
const { putObject } = require('../config/minio');
const sharp = require('sharp');
const ApiError = require('./ApiError');
const httpStatus = require('http-status');

const COMPRESSION_QUALITY = 100;

const uploadFiles = async (files) => {
  return Promise.all(
    files.map(async (file) => {
      if (!file.compress) {
        return putObject(file.filename, file.buffer, file.contentType);
      } else {
        const compressedFile = await sharp(file.buffer)
          .webp({ quality: COMPRESSION_QUALITY })
          .toBuffer();
        file.buffer = compressedFile;
        return putObject(file.filename, file.buffer, file.contentType);
      }
    })
  );
};

// get image buffer from image url
const getImageBuffer = async (url, options) => {
  try {
    const imageData = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    return imageData.data;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `row ${options.index}: Image not found on ${options.field} field`
    );
  }
};

// upload file from url instead of buffer
const uploadFileFromUrl = async (file) => {
  try {
    const buffer = await getImageBuffer(file.url);
    const config = [
      {
        ...file,
        buffer,
      },
    ];
    await uploadFiles(config);
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadFiles, uploadFileFromUrl, getImageBuffer };
