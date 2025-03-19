const { validators } = require("../validators");

const featureValueValidationRules = {
  "Brand Name": [
    { validator: validators.required },
    { validator: validators.length, params: [2, 50] },
  ],
  "Model Name": [
    { validator: validators.required },
    { validator: validators.length, params: [2, 50] },
  ],
  "Variant Name": [
    { validator: validators.required },
    { validator: validators.length, params: [2, 100] },
  ],
};

module.exports = { featureValueValidationRules };
