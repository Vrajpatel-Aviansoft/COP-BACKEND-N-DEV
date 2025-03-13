"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Icon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Icon.init(
    {
      icon_id: { 
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      icon_name: DataTypes.STRING,
      icon_image: DataTypes.STRING,
      status: DataTypes.TINYINT,
    },
    {
      sequelize,
      modelName: "Icon",
      timestamps: false,
      underscored: true,
      tableName: "cop_icon_ms",
    }
  );
  return Icon;
};
