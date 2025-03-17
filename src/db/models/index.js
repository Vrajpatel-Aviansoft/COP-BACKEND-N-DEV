"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../../config/database")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, 
    {
      host: config.host,
      dialect: config.dialect,
      port: config.port,
      dialectOptions: {
        timezone: 'Z', // Use UTC timezone for Sequelize
        connectTimeout: 10000,
        multipleStatements: true,
        insecureAuth: true,
        ssl: {
          require: true,
          ca: fs.readFileSync(path.resolve('./src/db/ca.pem')), // Path to the CA certificate
        },
      },
      pool: {
        max: 10, // Maximum number of connections
        min: 0,  // Minimum number of connections
        acquire: 30000, // Maximum time (ms) to acquire a connection
        idle: 10000,    // Maximum idle time (ms) before releasing a connection
      },
      define: {
        charset: "utf8mb4",
      },
      logging: console.log, //env === "development" ? console.log : false,
      ...config,
    });
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// db.sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("All tables synchronized successfully.");
//   })
//   .catch((err) => {
//     console.error("Error synchronizing tables:", err);
//   });

 
  
 

module.exports = db;
