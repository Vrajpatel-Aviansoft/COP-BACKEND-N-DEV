"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ServiceStation extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      ServiceStation.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      ServiceStation.belongsTo(models.State, {
        foreignKey: "state_id",
        as: "state",
      });
      ServiceStation.belongsTo(models.City, {
        foreignKey: "city_id",
        as: "city",
      });
      ServiceStation.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy",
      });
      ServiceStation.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  ServiceStation.init(
    {
      s_station_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      s_station_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      s_station_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      s_station_location: {
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
      email: {
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
      modelName: "ServiceStation",
      tableName: "cop_s_stations_ms",
      timestamps: true,
      underscored: true,
    }
  );

  return ServiceStation;
};
