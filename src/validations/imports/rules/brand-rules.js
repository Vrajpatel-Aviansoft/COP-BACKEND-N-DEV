const { validators } = require('../validators');

const brandValidationRules = {
  'Brand Name': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 25] },
  ],
  'Brand Logo': [
    { validator: validators.required },
    { validator: validators.imageUrl },
  ],
  'Brand Banner': [
    { validator: validators.required },
    { validator: validators.imageUrl },
  ],
  'Brand Description': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 1000] },
  ],
};

module.exports = { brandValidationRules };
