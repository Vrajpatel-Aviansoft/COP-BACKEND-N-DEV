const { sequelize } = require('./db/models');

const truncateAllTables = async () => {
  try {
    console.log('Database connection established.');
    const [tables] = await sequelize.query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = :databaseName;
    `,
      {
        replacements: { databaseName: 'u936514376_COPV2' },
      }
    );

    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Loop through and truncate each table
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`Truncating table: ${tableName}`);
      await sequelize.query(`TRUNCATE TABLE \`${tableName}\`;`);
      console.log(`Table ${tableName} truncated successfully.`);
    }

    // Enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('All tables truncated successfully.');
  } catch (error) {
    console.error('Error truncating tables:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

// Execute the truncation
truncateAllTables();
