"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rating.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      Rating.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "carModel",
      });
      Rating.belongsTo(models.RatingType, {
        foreignKey: "rating_type_id",
        as: "ratingType",
      });
    }
  }
  Rating.init(
    {
      rating_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      rating_type_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      rating_value: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "Rating",
      timestamps: true,
      underscored: true,
      tableName: "cop_ratings",
    }
  );

  return Rating;
};
