"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaxValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TaxValue.belongsTo(models.AllTax, {
        foreignKey: "tax_id",
        as: "alltax",
      });
    }
  }
  TaxValue.init(
    {
      tax_value_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      tax_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      percent: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "TaxValue",
      timestamps: true,
      underscored: true,
      tableName: "cop_tax_value",
    }
  );

  return TaxValue;
};
