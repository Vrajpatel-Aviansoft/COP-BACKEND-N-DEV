"use strict";
const { Model } = require("sequelize");
const { slugifyModel } = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Banner.belongsTo(models.BannerCategory, {
        foreignKey: "bc_id",
        as: "banner_category",
      });
      Banner.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      Banner.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "model",
      });
      Banner.belongsTo(models.Variant, {
        foreignKey: "variant_id",
        as: "variant",
      });
    }
  }
  Banner.init(
    {
      banner_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      bc_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      variant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      banner_heading: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      banner_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      banner_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image_alt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      banner_image_mob: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      btn_text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      btn_link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
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
      modelName: "Banner",
      timestamps: true,
      underscored: true,
      tableName: "cop_banners",
    }
  );
  return Banner;
};
