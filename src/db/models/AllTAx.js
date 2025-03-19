"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AllTax extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  AllTax.init(
    {
      tax_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      tax_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      condition_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      percent: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      value: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: true,
      },
      city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "AllTax",
      timestamps: true,
      underscored: true,
      tableName: "cop_taxes_ms",
    }
  );
  return AllTax;
};
