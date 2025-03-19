"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EvStation extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      EvStation.belongsTo(models.State, {
        foreignKey: "state_id",
        as: "state",
      });
      EvStation.belongsTo(models.City, {
        foreignKey: "city_id",
        as: "city",
      });
      EvStation.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy",
      });
      EvStation.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  EvStation.init(
    {
      evs_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      state_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      evs_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      evs_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      evs_location: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      evs_charging_slots: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      evs_charging_port_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      evs_charging_voltage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      evs_charging_rate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      evs_car_capacity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      evs_contact_number: {
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
      modelName: "EvStation",
      tableName: "cop_evs_ms",
      timestamps: true,
      underscored: true,
    }
  );

  return EvStation;
};
