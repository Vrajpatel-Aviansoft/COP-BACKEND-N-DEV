"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FeatureValue extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      FeatureValue.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      FeatureValue.belongsTo(models.CarModel, {
        foreignKey: "model_id",
        as: "carModel",
      });
      FeatureValue.belongsTo(models.Variant, {
        foreignKey: "variant_id",
        as: "variant",
      });
      FeatureValue.belongsTo(models.Specification, {
        foreignKey: "spec_id",
        as: "specification",
      });
      FeatureValue.belongsTo(models.Feature, {
        foreignKey: "feature_id",
        as: "feature",
      });
      FeatureValue.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy",
      });
      FeatureValue.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  FeatureValue.init(
    {
      fv_id: {
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
      variant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      spec_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      feature_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      feature_value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      key_highlight: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
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
    },
    {
      sequelize,
      modelName: "FeatureValue",
      tableName: "cop_fv",
      timestamps: true,
      underscored: true,
    }
  );

  return FeatureValue;
};
