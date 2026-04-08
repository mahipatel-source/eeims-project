require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/User');

const checkUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    const allUsers = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database');
      process.exit(0);
    }

    console.log('📋 All Users in Database:');
    allUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    const manager = allUsers.find(u => u.role === 'manager');
    if (manager) {
      console.log(`\n✅ Manager found: ${manager.email}`);
    } else {
      console.log('\n❌ No manager user found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
