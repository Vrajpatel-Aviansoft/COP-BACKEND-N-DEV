"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BannerCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // BannerCategory.belongsTo(models.User, {
      //   foreignKey: "created_by",
      //   as: "createdBy",
      // });
      // BannerCategory.belongsTo(models.User, {
      //   foreignKey: "updated_by",
      //   as: "updatedBy",
      // });
    }
  }
  BannerCategory.init(
    {
      bc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bc_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "BannerCategory",
      timestamps: true,
      underscored: true,
      tableName: "cop_bc_ms",
    }
  );
  return BannerCategory;
};
