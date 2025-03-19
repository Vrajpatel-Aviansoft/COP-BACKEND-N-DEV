'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Seo extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      Seo.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
        as: 'brand',
      });
      Seo.belongsTo(models.CarModel, {
        foreignKey: 'model_id',
        as: 'carModel',
      });
      Seo.belongsTo(models.Variant, {
        foreignKey: 'variant_id',
        as: 'variant',
      });
      Seo.belongsTo(models.SeoMetaTag, {
        foreignKey: 'meta_tag_id',
        as: 'seoMetaTag',
      });
      Seo.belongsTo(models.SeoPage, {
        foreignKey: 'page_id',
        as: 'seoPage',
      });
    }
  }

  Seo.init(
    {
      seo_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
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
      page_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      meta_tag_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      tag_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      seo_type: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: 'Seo',
      tableName: 'cop_seo_ms',
      timestamps: true,
      underscored: true,
    }
  );

  return Seo;
};
