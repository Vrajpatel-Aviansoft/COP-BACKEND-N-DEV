"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      remember_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role_id: {
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
      timestamps: true,
      underscored: true,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
