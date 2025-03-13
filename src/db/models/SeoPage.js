"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SeoPage extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {}
  }

  SeoPage.init(
    {
      page_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      page_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      page_current_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      page_slug: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "SeoPage",
      tableName: "cop_seo_pages_ms",
      timestamps: true,
      underscored: true,
    }
  );

  return SeoPage;
};
