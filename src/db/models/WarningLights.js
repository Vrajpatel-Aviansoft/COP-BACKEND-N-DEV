"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WarningLight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  WarningLight.init(
    {
      wl_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      wl_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wl_icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wl_video: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wl_heading: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wl_subheading: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wl_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      wl_status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: true,
      },
      wl_display_position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.STRING,
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
      modelName: "WarningLight",
      timestamps: true,
      underscored: true,
      tableName: "cop_cwl_ms",
    }
  );
  return WarningLight;
};
