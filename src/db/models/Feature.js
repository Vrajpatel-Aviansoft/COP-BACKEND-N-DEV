"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Feature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Feature.belongsTo(models.Specification, {
        foreignKey: "spec_id",
        as: "specification",
      });
      Feature.belongsTo(models.FeatureOption, {
        foreignKey: "fo_id",
        as: "featureOption",
      });
      Feature.belongsTo(models.StandardUnit, {
        foreignKey: "su_id",
        as: "standardUnit",
      });
      Feature.hasMany(models.FeatureValue, {
        foreignKey: "feature_id",
        as: "featureValue",
      });
      
    }
  }
  Feature.init(
    {
      feature_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      fuel_type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      spec_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      fo_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      su_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      features_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      features_image: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "Feature",
      timestamps: true,
      underscored: true,
      tableName: "cop_features_ms",
    }
  );

  return Feature;
};
