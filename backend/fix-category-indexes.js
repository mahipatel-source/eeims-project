const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'triveni@123',
      database: process.env.DB_NAME || 'eeims_db'
    });

    const [rows] = await conn.query(
      'SELECT DISTINCT INDEX_NAME FROM information_schema.statistics WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME LIKE ?',
      [process.env.DB_NAME || 'eeims_db', 'categories', 'name_%']
    );

    if (!rows.length) {
      console.log('No duplicate category name indexes found');
      await conn.end();
      return;
    }

    for (const row of rows) {
      console.log('Dropping index', row.INDEX_NAME);
      await conn.query(`ALTER TABLE categories DROP INDEX \`${row.INDEX_NAME}\``);
    }

    console.log('✅ Duplicate category name indexes removed');
    await conn.end();
  } catch (err) {
    console.error('❌ Failed to clean category indexes:', err);
    process.exit(1);
  }
})();
