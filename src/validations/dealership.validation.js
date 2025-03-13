const Joi = require("joi");

const createDealership = {
  formData: Joi.object().keys({
    // brand_name: Joi.string().required(),
    // brand_logo: Joi.string().required(),
    // brand_banner: Joi.string().required(),
    // brand_description: Joi.string().required(),
  }),
};

const updateDealership = {
  formData: Joi.object().keys({
    // brand_name: Joi.string().required(),
    // brand_description: Joi.string().required(),
  }),
};

module.exports = {
  createDealership,
  updateDealership,
};
