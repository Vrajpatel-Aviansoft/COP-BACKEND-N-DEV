"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpecificationCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SpecificationCategory.init(
    {
      sc_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      sc_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "SpecificationCategory",
      timestamps: false,
      underscored: true,
      tableName: "cop_sc_ms",
    }
  );
  return SpecificationCategory;
};
