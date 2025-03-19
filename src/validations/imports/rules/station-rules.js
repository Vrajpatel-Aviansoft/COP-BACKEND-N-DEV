const {
  fuelStationColumns,
  evStationColumns,
} = require("../columns/station-cols");
const { validators } = require("../validators");

const fuelStationValidationRules = {
  [fuelStationColumns.FUEL_STATION_NAME]: [{ validator: validators.required }],
  [fuelStationColumns.ADDRESS]: [{ validator: validators.required }],
  [fuelStationColumns.LOCATION]: [
    { validator: validators.required },
    { validator: validators.googleMapsUrl },
  ],
  [fuelStationColumns.STATE]: [{ validator: validators.required }],
  [fuelStationColumns.CITY]: [{ validator: validators.required }],
  [fuelStationColumns.CONTACT_NO]: [{ validator: validators.required }],
};

const evStationValidationRules = {
  [evStationColumns.EV_STATION_NAME]: [
    { validator: validators.required },
    { validator: validators.lettersNumbersSpaces },
    { validator: validators.string, params: [2, 30] },
  ],
  [evStationColumns.ADDRESS]: [
    { validator: validators.required },
    { validator: validators.string, params: [15, 700] },
  ],
  [evStationColumns.LOCATION]: [
    { validator: validators.required },
    { validator: validators.googleMapsUrl },
  ],
  [evStationColumns.STATE]: [{ validator: validators.required }],
  [evStationColumns.CITY]: [{ validator: validators.required }],
  [evStationColumns.CHARGING_SLOTS]: [
    { validator: validators.required },
    { validator: validators.string, params: [1, 30] },
  ],
  [evStationColumns.CHARGING_PORT_TYPE]: [
    { validator: validators.required },
    { validator: validators.string, params: [1, 30] },
  ],
  [evStationColumns.CHARGING_VOLTAGE]: [
    { validator: validators.required },
    { validator: validators.string, params: [1, 30] },
  ],
  [evStationColumns.CHARGING_RATE]: [
    { validator: validators.required },
    { validator: validators.string, params: [1, 30] },
  ],
  [evStationColumns.CAR_CAPACITY]: [
    { validator: validators.required },
    { validator: validators.string, params: [1, 30] },
  ],
  [evStationColumns.CONTACT_NO]: [
    { validator: validators.required },
    { validator: validators.string, params: [1, 30] },
  ],
};

module.exports = { fuelStationValidationRules, evStationValidationRules };
