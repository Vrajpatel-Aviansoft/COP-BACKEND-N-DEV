"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FuelStation extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      FuelStation.belongsTo(models.State, {
        foreignKey: "state_id",
        as: "state",
      });
      FuelStation.belongsTo(models.City, {
        foreignKey: "city_id",
        as: "city",
      });
      FuelStation.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy",
      });
      FuelStation.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  FuelStation.init(
    {
      f_station_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      f_station_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      f_station_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      f_station_location: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      state_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      contact_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "FuelStation",
      tableName: "cop_f_stations_ms",
      timestamps: true,
      underscored: true,
    }
  );

  return FuelStation;
};
