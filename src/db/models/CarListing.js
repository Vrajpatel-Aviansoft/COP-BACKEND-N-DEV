"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CarListing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CarListing.init(
    {
      cl_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      cl_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CarListing",
      timestamps: false,
      underscored: true,
      tableName: "cop_cl_ms",
    }
  );
  return CarListing;
};
