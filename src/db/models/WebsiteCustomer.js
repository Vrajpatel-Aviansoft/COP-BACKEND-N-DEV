"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WebsiteCustomer extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      WebsiteCustomer.belongsTo(models.Country, {
        foreignKey: "country_id",
        as: "country",
      });
      WebsiteCustomer.belongsTo(models.State, {
        foreignKey: "state_id",
        as: "state",
      });
      WebsiteCustomer.belongsTo(models.City, {
        foreignKey: "city_id",
        as: "city",
      });
    }
  }

  WebsiteCustomer.init(
    {
      customer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address_1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address_2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_pic: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
      },
      country_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      state_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      selected_city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      whatsapp_status: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
      },
      anniversary_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dob: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      consent_signed: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 1,
      },
      is_verified: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      toll_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      toll_count: {
        type: DataTypes.STRING,
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
      modelName: "WebsiteCustomer",
      tableName: "cop_customers",
      timestamps: true,
      underscored: true,
    }
  );

  return WebsiteCustomer;
};
