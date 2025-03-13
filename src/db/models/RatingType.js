"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RatingType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {

    }
  }
  RatingType.init(
    {
      rating_type_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      rating_type_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "RatingType",
      timestamps: true,
      underscored: true,
      tableName: "cop_rating_types",
    }
  );

  return RatingType;
};
