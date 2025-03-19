const { validators } = require("../validators");
const {
  variantColumns,
  variantColorColumns,
} = require("../columns/variant-cols");

const variantValidationRules = {
  [variantColumns.BRAND_NAME]: [{ validator: validators.required }],
  [variantColumns.MODEL_NAME]: [{ validator: validators.required }],
  [variantColumns.VARIANT_NAME]: [
    { validator: validators.required },
    { validator: validators.length, params: [2, 30] },
  ],
  [variantColumns.VARIANT_IMAGE]: [
    { validator: validators.required },
    { validator: validators.imageUrl },
  ],
  [variantColumns.SEATING_CAPACITY]: [{ validator: validators.required }],
};

const variantColorValidationRules = {
  [variantColorColumns.BRAND_NAME]: [{ validator: validators.required }],
  [variantColorColumns.MODEL_NAME]: [{ validator: validators.required }],
  [variantColorColumns.VARIANT_NAME]: [{ validator: validators.required }],
  [variantColorColumns.COLOR_NAME]: [{ validator: validators.required }],
  [variantColorColumns.COLOR_CODE]: [{ validator: validators.required }],
  [variantColorColumns.VARIANT_COLOR_IMAGE]: [
    { validator: validators.required },
    { validator: validators.imageUrl },
  ],
};

module.exports = { variantValidationRules, variantColorValidationRules };
