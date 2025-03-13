"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Specification extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      Specification.belongsTo(models.SpecificationCategory, {
        foreignKey: "sc_id",
        as: "spec_cat",
      });
      Specification.hasMany(models.Feature, {
        foreignKey: "spec_id",
        as: "feature",
      });
    }
  }

  Specification.init(
    {
      spec_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      sc_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      spec_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      spec_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "Specification",
      tableName: "cop_spec_ms",
      timestamps: true,
      underscored: true,
    }
  );

  return Specification;
};
