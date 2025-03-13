const validateRow = (row, rowNumber, validationRules) => {
  const errors = [];
  if (!row || typeof row !== 'object') {
    errors.push(`Row ${rowNumber}: Invalid row format`);
    return errors;
  }

  Object.entries(validationRules).forEach(([fieldName, rules]) => {
    const value = row[fieldName];
    rules.forEach(({ validator, params = [] }) => {
      if (validator) {
        const error = validator(value, fieldName, rowNumber, ...params);
        if (error) {
          errors.push(error);
        }
      }
    });
  });

  return errors;
};

const validateData = (rows, validationRules, duplicateCheckColumn = null) => {
  const errors = [];
  const seenValues = new Set();
  if (!Array.isArray(rows) || rows.length === 0) {
    errors.push('No data found in the Excel file');
    return errors;
  }

  rows.forEach((row, index) => {
    const rowNumber = index + 1;

    const rowErrors = validateRow(row, rowNumber, validationRules);
    errors.push(...rowErrors);
    if (duplicateCheckColumn) {
      const valueToCheck = row[duplicateCheckColumn];
      if (seenValues.has(valueToCheck)) {
        errors.push(
          `Row ${rowNumber}: Duplicate value found in column "${duplicateCheckColumn}" (${valueToCheck})`
        );
      } else {
        seenValues.add(valueToCheck);
      }
    }
  });

  return errors;
};

module.exports = { validateData };
