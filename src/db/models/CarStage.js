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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      timestamps: true,
      underscored: true,
    }
  );

  return CarStage;
};
