"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PriceEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PriceEntry.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      PriceEntry.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "carModel",
      });
      PriceEntry.belongsTo(models.Variant, {
        foreignKey: "variant_id",
        as: "variant",
      });
      PriceEntry.belongsTo(models.Country, {
        foreignKey: "country_id",
        as: "country",
      });
      PriceEntry.belongsTo(models.State, {
        foreignKey: "state_id",
        as: "state",
      });
      PriceEntry.belongsTo(models.City, {
        foreignKey: "city_id",
        as: "city",
      });
      PriceEntry.belongsTo(models.City, {
        foreignKey: "against_city_id",
        as: "against_city",
      });
      PriceEntry.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy",
      });
      PriceEntry.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }
  PriceEntry.init(
    {
      pe_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      variant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      country_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      state_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      against_city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      i_rto_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      c_rto_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      tax_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      ex_showroom_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      tax_cost: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      total_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      total_price_c: {
        type: DataTypes.DOUBLE,
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
        defaultValue: null,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "PriceEntry",
      timestamps: true,
      underscored: true,
      tableName: "cop_pe_ms",
    }
  );

  return PriceEntry;
};
