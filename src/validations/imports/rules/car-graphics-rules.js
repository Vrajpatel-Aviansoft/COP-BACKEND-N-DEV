const { validators } = require("../validators");
const {
  carGraphicsImageCols,
  carGraphicsVideoCols,
} = require("../columns/car-graphics-cols");

const carGraphicsImagesValidationRules = {
  [carGraphicsImageCols.BRAND_NAME]: [{ validator: validators.required }],
  [carGraphicsImageCols.MODEL_NAME]: [{ validator: validators.required }],
  [carGraphicsImageCols.CAR_IMAGES]: [{ validator: validators.required }],
  [carGraphicsImageCols.CAR_IMAGES_ALT]: [{ validator: validators.required }],
  [carGraphicsImageCols.CAR_IMAGES_MOBILE]: [
    { validator: validators.required },
  ],
  [carGraphicsImageCols.CAR_IMAGES_MOBILE_ALT]: [
    { validator: validators.required },
  ],
};

const carGraphicsVideosValidationRules = {
  [carGraphicsVideoCols.BRAND_NAME]: [{ validator: validators.required }],
  [carGraphicsVideoCols.MODEL_NAME]: [{ validator: validators.required }],
  [carGraphicsVideoCols.CAR_VIDEOS]: [{ validator: validators.required }],
};

module.exports = {
  carGraphicsImagesValidationRules,
  carGraphicsVideosValidationRules,
};
