"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class B2BInquiry extends Model {
    /**
     * Define associations here if any
     */
  }

  B2BInquiry.init(
    {
      dealer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dealer_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dealer_address: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "B2BInquiry",
      tableName: "b2b_dealer_inquiry",
      timestamps: true,
      underscored: true,
    }
  );

  return B2BInquiry;
};
