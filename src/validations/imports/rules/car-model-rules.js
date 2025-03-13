const { validators } = require('../validators');

const carModelLaunchedValidationRules = {
  'Car Type': [{ validator: validators.required }],
  'Brand Name': [{ validator: validators.required }],
  'Model Name': [
    { validator: validators.required },
    { validator: validators.length, params: [2, 30] },
  ],
  'Model Image': [
    { validator: validators.required },
    { validator: validators.imageUrl },
  ],
  'Model Description': [
    { validator: validators.required },
    { validator: validators.length, params: [2, 1000] },
  ],
  'Min Price': [
    { validator: validators.required },
    {
      validator: validators.number,
      params: [200000, Infinity],
    },
  ],
  'Max Price': [
    { validator: validators.required },
    { validator: validators.number, params: [0, 500000000] },
  ],
  'Model Engine': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model BHP': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Transmission': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Mileage': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Fuel': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'NCAP/BCAP': [{ validator: validators.required }],
  Ratings: [
    { validator: validators.required },
    { validator: validators.number, params: [1, 5] },
  ],
};

const carModelUpcomingValidationRules = {
  'Car Type': [{ validator: validators.required }],
  'Brand Name': [{ validator: validators.required }],
  'Model Name': [
    { validator: validators.required },
    { validator: validators.length, params: [2, 30] },
  ],
  'Launch Date': [
    { validator: validators.required },
    {
      validator: validators.futureDate,
    },
  ],
  'Model Image': [
    { validator: validators.required },
    { validator: validators.imageUrl },
  ],
  'Model Description': [
    { validator: validators.required },
    { validator: validators.length, params: [2, 1000] },
  ],
  'Min Price': [
    { validator: validators.required },
    {
      validator: validators.number,
      params: [200000, Infinity],
    },
  ],
  'Max Price': [
    { validator: validators.required },
    { validator: validators.number, params: [200000, 500000000] },
    { validator: validators.gt, params: ['Min Price'] },
  ],
  'Model Engine': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model BHP': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Transmission': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Mileage': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Fuel': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
};

const carModelEvLaunchedValidationRules = {
  'Car Type': [{ validator: validators.required }],
  'Brand Name': [{ validator: validators.required }],
  'Model Name': [
    { validator: validators.required },
    { validator: validators.length, params: [2, 30] },
  ],
  'Model Image': [
    { validator: validators.required },
    { validator: validators.imageUrl },
  ],
  'Model Description': [
    { validator: validators.required },
    { validator: validators.length, params: [2, 1000] },
  ],
  'Min Price': [
    { validator: validators.required },
    {
      validator: validators.number,
      params: [200000, Infinity],
    },
  ],
  'Max Price': [
    { validator: validators.required },
    { validator: validators.number, params: [0, 500000000] },
  ],
  'Battery Capacity': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Power': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Transmission': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Driving Range': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Charging Time': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'NCAP/BCAP': [{ validator: validators.required }],
  Ratings: [
    { validator: validators.required },
    { validator: validators.number, params: [1, 5] },
  ],
};

const carModelEvUpcomingValidationRules = {
  'Car Type': [{ validator: validators.required }],
  'Brand Name': [{ validator: validators.required }],
  'Model Name': [
    { validator: validators.required },
    { validator: validators.length, params: [2, 30] },
  ],
  'Launch Date': [
    { validator: validators.required },
    {
      validator: validators.futureDate,
    },
  ],
  'Model Image': [
    { validator: validators.required },
    { validator: validators.imageUrl },
  ],
  'Model Description': [
    { validator: validators.required },
    { validator: validators.length, params: [2, 1000] },
  ],
  'Min Price': [
    { validator: validators.required },
    {
      validator: validators.number,
      params: [200000, Infinity],
    },
  ],
  'Max Price': [
    { validator: validators.required },
    { validator: validators.number, params: [200000, 500000000] },
    { validator: validators.gt, params: ['Min Price'] },
  ],
  'Battery Capacity': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Power': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Model Transmission': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Driving Range': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
  'Charging Time': [
    { validator: validators.required },
    { validator: validators.string, params: [2, 20] },
  ],
};

module.exports = {
  carModelLaunchedValidationRules,
  carModelUpcomingValidationRules,
  carModelEvLaunchedValidationRules,
  carModelEvUpcomingValidationRules,
};
