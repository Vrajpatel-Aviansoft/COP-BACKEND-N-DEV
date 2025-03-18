"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoleHasPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoleHasPermission.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
      RoleHasPermission.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        as: "permission",
      });
    }
  }
  RoleHasPermission.init(
    {
      permission_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "permissions",
          key: "id",
        },
      },
      role_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "RoleHasPermission",
      tableName: "role_has_permissions",
      timestamps: false,
    }
  );
  return RoleHasPermission;
};
