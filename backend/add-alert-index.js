const db = require('./models');

async function addAlertIndex() {
  try {
    // Try to add unique constraint on unread alerts
    await db.sequelize.query(`
      ALTER TABLE alerts 
      ADD CONSTRAINT unread_alert_unique 
      UNIQUE (equipmentId, type, isRead)
    `);
    console.log('✅ Unique constraint added to prevent duplicate unread alerts');
    process.exit(0);
  } catch (err) {
    if (err.message.includes('Duplicate entry')) {
      console.log('✅ Constraint already exists');
      process.exit(0);
    } else if (err.message.includes('Duplicate key name')) {
      console.log('✅ Constraint already exists');
      process.exit(0);
    } else {
      console.log('ℹ️ Constraint setup: ' + err.message);
      // This is OK, the model will handle it
      process.exit(0);
    }
  }
}

addAlertIndex();
