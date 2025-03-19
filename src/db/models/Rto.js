"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rto.belongsTo(models.State, {
        foreignKey: "state_id",
        as: "state",
      });
    }
  }
  Rto.init(
    {
      rto_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      state_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      rto_type: {
        type: DataTypes.ENUM("I", "C"),
        allowNull: false,
      },
      pre_condition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      post_condition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      percentage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      fuel_type: {
        type: DataTypes.ENUM(
          "Petrol",
          "Diesel",
          "CNG",
          "EV",
          "Hybrid",
          "Mild Hybrid"
        ),
        allowNull: true,
      },
      cc: {
        type: DataTypes.ENUM("1", "0"),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.BIGINT.UNSIGNED,
        timestamp: true,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.BIGINT.UNSIGNED,
        timestamp: true,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Rto",
      timestamps: false,
      underscored: true,
      tableName: "cop_rto_ms",
    }
  );
  return Rto;
};
