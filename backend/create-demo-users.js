const bcrypt = require('bcryptjs');
require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/User');

const createDemoUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const demoUsers = [
      { name: 'System Admin', email: 'admin@eeims.com', password: 'Admin@123', role: 'admin' },
      { name: 'Manager User', email: 'manager@eeims.com', password: 'Manager@123', role: 'manager' },
      { name: 'John Technician', email: 'tech@eeims.com', password: 'Tech@123', role: 'technician' }
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
