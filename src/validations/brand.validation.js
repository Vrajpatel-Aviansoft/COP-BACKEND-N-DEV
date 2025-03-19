const Joi = require("joi");

const createBrand = {
  formData: Joi.object().keys({
    brand_name: Joi.string().required(),
    brand_logo: Joi.string().required(),
    brand_banner: Joi.string().required(),
    brand_description: Joi.string().required(),
  }),
};

const updateBrand = {
  formData: Joi.object().keys({
    brand_name: Joi.string().required(),
    brand_description: Joi.string().required(),
  }),
};

module.exports = {
  createBrand,
  updateBrand,
};
