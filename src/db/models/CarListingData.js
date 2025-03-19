"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CarListingData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CarListingData.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      CarListingData.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "model",
      });
      CarListingData.belongsTo(models.CarListing, {
        foreignKey: "cl_id",
        as: "car_listing",
      });
    }
  }
  CarListingData.init(
    {
      cl_data_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      cl_id: {
        type: DataTypes.BIGINT.UNSIGNED,
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
    },
    {
      sequelize,
      modelName: "CarListingData",
      timestamps: true,
      underscored: true,
      tableName: "cop_cl_data",
    }
  );
  return CarListingData;
};
