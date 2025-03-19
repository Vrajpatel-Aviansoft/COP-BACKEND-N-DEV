const { keyHighlightCols } = require("../columns/key-highlight-cols");
const { validators } = require("../validators");

const keyHighlightValidationRules = {
  [keyHighlightCols.BRAND_NAME]: [{ validator: validators.required }],
  [keyHighlightCols.MODEL_NAME]: [{ validator: validators.required }],
  [keyHighlightCols.VARIANT_NAME]: [{ validator: validators.required }],
  [keyHighlightCols.KEY_HIGHLIGHT]: [{ validator: validators.required }],
};

module.exports = { keyHighlightValidationRules };
