"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DealerShip extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      DealerShip.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      DealerShip.belongsTo(models.State, {
        foreignKey: "state_id",
        as: "state",
      });
      DealerShip.belongsTo(models.City, {
        foreignKey: "city_id",
        as: "city",
      });
    }
  }

  DealerShip.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
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
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dealer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      map_location: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      modelName: "DealerShip",
      tableName: "cop_dealer",
      timestamps: true,
      underscored: true,
    }
  );

  return DealerShip;
};
