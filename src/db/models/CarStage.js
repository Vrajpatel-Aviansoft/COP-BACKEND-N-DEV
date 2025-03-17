"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CarStage extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      // define association here
    }
  }

  CarStage.init(
    {
      cs_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      cs_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "CarStage",
      tableName: "cop_cs_ms",
      timestamps: false,
    }
  );

  return CarStage;
};
