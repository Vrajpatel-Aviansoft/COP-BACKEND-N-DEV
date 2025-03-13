"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    /**
     * Define associations here
     */
    static associate(models) {
      Color.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });

      Color.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "model",
      });

      Color.belongsTo(models.Variant, {
        foreignKey: "variant_id",
        as: "variant",
      });

      Color.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      Color.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  Color.init(
    {
      color_id: {
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
      color_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      color_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      dual_color_code: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      variant_color_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      variant_color_image_mob: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    },
    {
      sequelize,
      modelName: "Color",
      tableName: "cop_colors",
      timestamps: true,
      underscored: true,
    }
  );

  return Color;
};
