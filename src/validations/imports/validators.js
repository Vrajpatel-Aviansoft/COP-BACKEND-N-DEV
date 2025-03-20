const validators = {
  required: (value, fieldName, rowNumber) => {
    if (typeof value === 'number') {
      if (
        value === undefined ||
        value === null ||
        isNaN(value) ||
        value === ''
      ) {
        return `Row ${rowNumber}: ${fieldName} is required and must be a valid number`;
      }
    } else {
      if (!value?.trim()) {
        return `Row ${rowNumber}: ${fieldName} is required`;
      }
    }
    return null;
  },

  length: (value, fieldName, rowNumber, min, max) => {
    const trimmedValue = value?.trim() || '';
    if (trimmedValue.length < min || trimmedValue.length > max) {
      return `Row ${rowNumber}: ${fieldName} must be between ${min} to ${max} characters`;
    }
    return null;
  },

  number: (value, fieldName, rowNumber, min, max) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return `Row ${rowNumber}: ${fieldName} must be a valid number`;
    }
    if (value < min || value > max) {
      return `Row ${rowNumber}: ${fieldName} must be between ${min} and ${max}`;
    }
    return null;
  },

  string: (value, fieldName, rowNumber, min, max) => {
    const stringValue =
      value !== null && value !== undefined ? value?.toString()?.trim() : '';
    if (stringValue.length < min || stringValue.length > max) {
      return `Row ${rowNumber}: ${fieldName} as a string must be between ${min} and ${max} characters`;
    }
    const containsAlphabet = /[a-zA-Z]/;
    const isOnlySpecialOrNumbers = /^[^a-zA-Z]*$/;

    if (
      isOnlySpecialOrNumbers.test(stringValue) ||
      !containsAlphabet.test(stringValue)
    ) {
      return `Row ${rowNumber}: ${fieldName} must contain at least one alphabetic character and cannot consist only of special characters or numbers`;
    }
    return null;
  },
  imageUrl: (value, fieldName, rowNumber) => {
    const trimmedValue = value?.trim() || '';
    const lowercaseUrl = trimmedValue.toLowerCase();

    //const validUrlPattern = /^https:\/\/cloud\.aviansoft\.in/;

    // if (!validUrlPattern.test(lowercaseUrl)) {
    //   return `Row ${rowNumber}: ${fieldName} must match the format https://cloud.aviansoft.in/<filename>`;
    // }

    //   const validUrlPattern = /^https:\/\/static\.caronphone\.com/;
    // if (!validUrlPattern.test(lowercaseUrl)) {
    //     return `Row ${rowNumber}: ${fieldName} must match the format https://static.caronphone.com/<filename>`;
    //   }
    const validImageExtensionPattern = /\.(png|jpg|jpeg|webp)$/;
    if ( !validImageExtensionPattern.test(lowercaseUrl)) {
      return `Row ${rowNumber}: ${fieldName} must contain a valid image extension (.png, .jpg, .jpeg, .webp)`;
    }

    return null;
  },
  googleMapsUrl: (value, fieldName, rowNumber) => {
    const trimmedValue = value?.trim() || '';
    const googleMapsRegex =
      /^https:\/\/www\.google\.com\/maps\/place\/[^/]+\/@[-\d.]+,[-\d.]+,\d+z\/data=.+$/;

    if (!googleMapsRegex.test(trimmedValue)) {
      return `Row ${rowNumber}: ${fieldName} must be a valid Google Maps URL in the required format`;
    }

    return null;
  },

  lettersNumbersSpaces: (value, fieldName, rowNumber) => {
    const trimmedValue = value?.trim() || '';
    const validRegex = /^[a-zA-Z0-9\s]+$/;

    if (!validRegex.test(trimmedValue)) {
      return `Row ${rowNumber}: ${fieldName} must contain only letters, numbers, and spaces`;
    }

    return null;
  },

  date: (value, fieldName, rowNumber) => {
    const trimmedValue = value?.trim() || '';
    const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

    if (!datePattern.test(trimmedValue)) {
      return `Row ${rowNumber}: ${fieldName} must be a valid date in the format YYYY-MM-DD`;
    }

    return null;
  },

  futureDate: (value, fieldName, rowNumber) => {
    const trimmedValue = value?.trim() || '';
    const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!datePattern.test(trimmedValue)) {
      return `Row ${rowNumber}: ${fieldName} must be a valid date in the format YYYY-MM-DD`;
    }
    const inputDate = new Date(trimmedValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate <= today) {
      return `Row ${rowNumber}: ${fieldName} must be a future date`;
    }

    return null;
  },
};

module.exports = { validators };
