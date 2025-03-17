"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CarType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CarType.init(
    {
      ct_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      ct_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ct_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "CarType",
      timestamps: false,
      underscored: true,
      tableName: "cop_ct_ms",
    }
  );
  return CarType;
};
