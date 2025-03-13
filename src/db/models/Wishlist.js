"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      Wishlist.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "model",
      });
      Wishlist.belongsTo(models.WebsiteCustomer, {
        foreignKey: "customer_id",
        as: "websitecustomer",
      });
      Wishlist.belongsTo(models.Variant, {
        foreignKey: "variant_id",
        as: "variant",
      });
    }
  }

  Wishlist.init(
    {
      wl_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      customer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      created_date: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
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
      variant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "cop_wl",
      timestamps: true,
      underscored: true,
    }
  );

  return Wishlist;
};
