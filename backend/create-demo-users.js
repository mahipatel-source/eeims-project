const bcrypt = require('bcryptjs');
require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/User');

const createDemoUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const demoUsers = [
      { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
      { name: 'Manager User', email: 'manager@example.com', password: 'password123', role: 'manager' },
      { name: 'John Technician', email: 'technician@example.com', password: 'password123', role: 'technician' }
    ];

    for (const demoUser of demoUsers) {
      const existing = await User.findOne({ where: { email: demoUser.email } });
      if (existing) {
        console.log(`• Already exists: ${demoUser.email}`);
      } else {
        await User.create({
          ...demoUser,
          password: await bcrypt.hash(demoUser.password, 10),
        });
        console.log(`• Created: ${demoUser.email}`);
      }
    }

    console.log('✅ Demo users created or verified successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create demo users:', error);
    process.exit(1);
  }
};

createDemoUsers();
