"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StandardUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StandardUnit.init(
    {
      su_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      su_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StandardUnit",
      timestamps: true,
      underscored: true,
      tableName: "cop_su_ms",
    }
  );
  return StandardUnit;
};
