'use strict';
const { Model } = require('sequelize');
const { slugifyModel } = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  class CarModel extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      CarModel.belongsTo(models.CarStage, {
        foreignKey: 'cs_id',
        as: 'car_stage',
      });
      CarModel.belongsTo(models.CarType, {
        foreignKey: 'ct_id',
        as: 'car_type',
      });
      CarModel.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
        as: 'brand',
      });
    }
  }

  CarModel.init(
    {
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      cs_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      launch_date: {
        type: DataTypes.DATE,
      },
      ct_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      model_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      model_image: {
        type: DataTypes.STRING,
      },
      model_image_mob: {
        type: DataTypes.STRING,
      },
      image_alt: {
        type: DataTypes.STRING,
      },
      image_title: {
        type: DataTypes.STRING,
      },
      model_description: {
        type: DataTypes.TEXT,
      },
      min_price: {
        type: DataTypes.INTEGER,
      },
      max_price: {
        type: DataTypes.INTEGER,
      },
      model_year: {
        type: DataTypes.STRING,
      },
      model_type: {
        type: DataTypes.STRING,
      },
      cbu_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'CarModel',
      tableName: 'cop_models',
      timestamps: true,
      underscored: true,
    }
  );
  slugifyModel(CarModel, {
    source: ['model_name'],
    slugField: 'slug',
    column: 'slug',
  });

  return CarModel;
};
