'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all table names excluding 'tokens' and 'SequelizeMeta'
    const tables = await queryInterface.sequelize.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'copv2'
         AND table_type = 'BASE TABLE'
         AND table_name NOT IN ('tokens', 'SequelizeMeta')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const table of tables) {
      const tableName = table.table_name || table.TABLE_NAME;

      try {
        const columns = await queryInterface.describeTable(tableName);

        if (!columns.uuid) {
          // Step 1: Add the uuid column (nullable and not unique)
          await queryInterface.addColumn(tableName, 'uuid', {
            type: Sequelize.STRING(36),
            allowNull: true,
          });

          // Step 2: Populate uuid column for existing rows
          await queryInterface.sequelize.query(
            `UPDATE ${tableName} SET uuid = UUID() WHERE uuid IS NULL;`
          );

          // Step 3: Alter the column to be NOT NULL and UNIQUE
          await queryInterface.changeColumn(tableName, 'uuid', {
            type: Sequelize.STRING(36),
            allowNull: false,
            unique: true,
          });
        }
      } catch (error) {
        throw error;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.sequelize.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'copv2'
         AND table_type = 'BASE TABLE'
         AND table_name NOT IN ('tokens', 'SequelizeMeta')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const table of tables) {
      const tableName = table.table_name || table.TABLE_NAME;

      try {
        const columns = await queryInterface.describeTable(tableName);

        if (columns.uuid) {
          await queryInterface.removeColumn(tableName, 'uuid');
        }
      } catch (error) {
        console.error(`Failed to process table ${tableName}:`, error);
        throw error;
      }
    }
  },
};
