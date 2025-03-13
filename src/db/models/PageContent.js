"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PageContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  PageContent.init(
    {
      pc_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      pc_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pc_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pc_sub_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pc_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pc_m_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pc_m_sub_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pc_m_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pc_b_text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pc_b_link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pc_b_type: {
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
    },
    {
      sequelize,
      modelName: "PageContent",
      timestamps: true,
      underscored: true,
      tableName: "cop_pc",
    }
  );
  return PageContent;
};
