const { validators } = require("../validators");

const reviewValidationRules = {
  "Full Name": [
    { validator: validators.required, message: "The first name is required." },
    {
      validator: validators.length,
      params: [2, 25],
      message: "The first name must be between 2 and 25 characters.",
    },
  ],

  "Brand Name": [
    { validator: validators.required, message: "The brand name is required." },
  ],
  "Model Name": [
    { validator: validators.required, message: "The model name is required." },
    {
      validator: validators.length,
      params: [2, 1000],
      message: "The model name must be between 2 and 1000 characters.",
    },
  ],
  Rating: [
    { validator: validators.required, message: "The rating is required." },
  ],
  Review: [
    { validator: validators.required, message: "The review is required." },
    {
      validator: validators.length,
      params: [2, 1000],
      message: "The review must be between 2 and 1000 characters.",
    },
  ],
};

module.exports = { reviewValidationRules };
