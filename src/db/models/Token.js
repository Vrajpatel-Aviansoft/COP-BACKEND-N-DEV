'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Token.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Token.init(
    {
      token: DataTypes.STRING,
      user_id: DataTypes.BIGINT.UNSIGNED,
      expires: DataTypes.DATE,
      type: DataTypes.STRING,
      blacklisted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Token',
      tableName: 'tokens',
      underscored: true,
    }
  );
  return Token;
};
