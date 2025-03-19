'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('users')) {
      throw new Error(
        'Users table does not exist. Please run the Users migration first.'
      );
    }

    await queryInterface.createTable('Tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      token: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      expires: {
        type: Sequelize.DATE,
      },
      type: {
        type: Sequelize.STRING,
      },
      blacklisted: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens');
  },
};
