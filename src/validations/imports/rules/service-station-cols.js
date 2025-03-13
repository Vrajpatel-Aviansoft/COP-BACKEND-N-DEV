const { validators } = require("../validators");

const serviceStationValidationRules = {
  "Brand Name": [
    { validator: validators.required, message: "The brand name is required." },
  ],
  "Service Station Name": [
    {
      validator: validators.required,
      message: "The dealer's name is required.",
    },
    {
      validator: validators.length,
      params: [2, 25],
      message: "The dealer's name must be between 2 and 25 characters.",
    },
  ],
  Address: [
    { validator: validators.required, message: "The address is required." },
    {
      validator: validators.length,
      params: [2, 1000],
      message: "The address must be between 2 and 1000 characters.",
    },
  ],
  Location: [
    { validator: validators.required, message: "The location is required." },
  ],
  State: [
    { validator: validators.required, message: "The state is required." },
  ],
  City: [{ validator: validators.required, message: "The city is required." }],
  "Contact No.": [
    {
      validator: validators.required,
      message: "The contact number is required.",
    },
  ],
  Email: [
    { validator: validators.required, message: "The email is required." },
  ],
};

module.exports = { serviceStationValidationRules };
