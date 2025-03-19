"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      State.belongsTo(models.Country, {
        foreignKey: "country_id",
        as: "country",
      });
    }
  }
  State.init(
    {
      state_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      country_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      state_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cbu_rto: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_ut: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: true,
        comment: "0 = State, 1 = UT",
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "State",
      timestamps: true,
      underscored: true,
      tableName: "cop_state_ms",
    }
  );
  return State;
};
