const { validators } = require("../validators");

const priceEntryValidationRules = {
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
  "State": [
    { validator: validators.required },
    { validator: validators.length, params: [2, 50] },
  ],
  "City": [
    { validator: validators.required },
    { validator: validators.length, params: [2, 50] },
  ],
  "Price": [
    { validator: validators.required },
    { validator: validators.number },
    { validator: validators.min, params: [0] },
  ],
};

module.exports = { priceEntryValidationRules };
