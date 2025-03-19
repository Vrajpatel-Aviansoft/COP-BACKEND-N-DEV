'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SeoMetaTag extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {}
  }

  SeoMetaTag.init(
    {
      meta_tag_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      meta_tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      meta_tag_type: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      modelName: 'SeoMetaTag',
      tableName: 'cop_seo_meta_tags_ms',
      timestamps: true,
      underscored: true,
    }
  );

  return SeoMetaTag;
};
