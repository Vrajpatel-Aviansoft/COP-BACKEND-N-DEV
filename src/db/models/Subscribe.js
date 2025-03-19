"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subscribe extends Model {
    /**
     * Define associations here if any
     */
    // static associate(models) {
    //   Subscribe.belongsTo(models.City, {
    //     foreignKey: "city_id",
    //     as: "city",
    //   });
    // }
  }

  Subscribe.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT(1),
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
      modelName: "Subscribe",
      tableName: "cop_subscribe",
      timestamps: true,
      underscored: true,
    }
  );

  return Subscribe;
};
