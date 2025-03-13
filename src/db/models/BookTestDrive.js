"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookTestDrive extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      BookTestDrive.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      BookTestDrive.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "model",
      });
      BookTestDrive.belongsTo(models.DealerShip, {
        foreignKey: "dealer_id",
        as: "dealership",
      });
      BookTestDrive.belongsTo(models.WebsiteCustomer, {
        foreignKey: "customer_id",
        as: "websitecustomer",
      });
      BookTestDrive.belongsTo(models.Country, {
        foreignKey: "country_id",
        as: "country",
      });
      BookTestDrive.belongsTo(models.State, {
        foreignKey: "state_id",
        as: "state",
      });
      BookTestDrive.belongsTo(models.City, {
        foreignKey: "city_id",
        as: "city",
      });
    }
  }

  BookTestDrive.init(
    {
      btest_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
      customer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
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
      dealer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      manager_user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      fuel_types: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transmission: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      additional_notes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      btest_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estimated_purchase_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      btest_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
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
      booking_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "BookTestDrive",
      tableName: "cop_book_test_drives",
      timestamps: true,
      underscored: true,
    }
  );

  return BookTestDrive;
};
