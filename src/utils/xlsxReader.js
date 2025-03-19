const xlsx = require("xlsx");

const readXlsxFromBuffer = (buffer) => {
  try {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheets = workbook.SheetNames;
    const firstSheet = workbook.Sheets[sheets[0]];
    return xlsx.utils.sheet_to_json(firstSheet);
  } catch (error) {
    throw error;
  }
};

module.exports = { readXlsxFromBuffer };
