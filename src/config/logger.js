const winston = require("winston");
const config = require("./config");

let currentDate = new Date();

let day = String(currentDate.getDate()).padStart(2, '0');
let month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
let year = currentDate.getFullYear();

let formattedDate = day + month + year;

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
    //new winston.transports.File({ filename: `src/logs/${formattedDate}-combined.log` }),
  ],
});

module.exports = logger;
