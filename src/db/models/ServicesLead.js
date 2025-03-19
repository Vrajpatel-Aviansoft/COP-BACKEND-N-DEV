"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ServicesLead extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      ServicesLead.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      ServicesLead.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "model",
      });
      ServicesLead.belongsTo(models.City, {
        foreignKey: "city_id",
        as: "city",
      });
    }
  }

  ServicesLead.init(
    {
      sl_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      category: {
        type: DataTypes.ENUM('I', 'L'),
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
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
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "ServicesLead",
      tableName: "cop_services_lead",
      timestamps: true,
      underscored: true,
    }
  );

  return ServicesLead;
};
