const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const fs = require("fs");

const env = process.env.NODE_ENV || "development";
const baseEnvFilePath = `.env.${env}`;
const localEnvFilePath = `${baseEnvFilePath}.local`;

if (fs.existsSync(baseEnvFilePath)) {
  dotenv.config({ path: baseEnvFilePath });
} else if (fs.existsSync(localEnvFilePath)) {
  dotenv.config({ path: localEnvFilePath });
} else {
  dotenv.config();
  console.log('Loaded .env');
}

//dotenv.config({ path: path.join(__dirname, `../../.env.${env}`) });

console.log(`Loaded environment: ${env}`);
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app'
    ),
    DB_HOST: Joi.string().required().description('Database host'),
    DB_PORT: Joi.number().default(3306).description('Database port'),
    DB_NAME: Joi.string().required().description('Database name'),
    DB_USER: Joi.string().required().description('Database username'),
    DB_PASSWORD: Joi.string().allow('', null).description('Database password'),
    MINIO_ACCESS_KEY_ID: Joi.string()
      .required()
      .description('Minio access key'),
    MINIO_SECRET_ACCESS_KEY: Joi.string()
      .required()
      .description('Minio secret key'),
    MINIO_ENDPOINT: Joi.string().required().description('Minio endpoint'),
    MINIO_BUCKET: Joi.string().required().description('Minio bucket'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  minio: {
    accessKey: envVars.MINIO_ACCESS_KEY_ID,
    secretKey: envVars.MINIO_SECRET_ACCESS_KEY,
    endPoint: envVars.MINIO_ENDPOINT,
    bucket: envVars.MINIO_BUCKET,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  database: {
    development: {
      username: envVars.DB_USER,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_NAME,
      host: envVars.DB_HOST,
      port: envVars.DB_PORT,
      logging: false,
      dialect: 'mysql',
      dialectModule: require('mysql2'),
    },
    test: {
      username: envVars.DB_USER,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_NAME,
      host: envVars.DB_HOST,
      port: envVars.DB_PORT,
      dialect: 'mysql',
      dialectModule: require('mysql2'),
    },
    production: {
      dialect: "sqlite",
      storage: ":memory:", // Use in-memory SQLite
    },
    // production: {
    //   username: envVars.DB_USER,
    //   password: envVars.DB_PASSWORD,
    //   database: envVars.DB_NAME,
    //   host: envVars.DB_HOST,
    //   port: envVars.DB_PORT,
    //   dialect: 'mysql',
    //   dialectModule: require('mysql2'),
    // },
  },
};
