"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CarGraphics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CarGraphics.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      CarGraphics.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "model",
      });
      CarGraphics.belongsTo(models.CarGraphicType, {
        foreignKey: "gt_id",
        as: "graphic_type",
      });
    }
  }
  CarGraphics.init(
    {
      graphic_id: {
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
      gt_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      graphic_file: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      graphic_file_alt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      graphic_file_mob: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      graphic_file_mob_alt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: "CarGraphics",
      timestamps: false,
      underscored: true,
      tableName: "cop_graphics",
    }
  );
  return CarGraphics;
};
