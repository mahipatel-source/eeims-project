require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/User');

const createManager = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check if manager already exists
    const existing = await User.findOne({ where: { email: 'manager@example.com' } });
    if (existing) {
      console.log('⚠️  Manager user already exists:', existing.email);
      process.exit(0);
    }

    // Create manager user with plaintext password (will be hashed by hook)
    const manager = await User.create({
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'password123',
      role: 'manager'
    });

    console.log('✅ Manager user created successfully:');
    console.log(`   Email: ${manager.email}`);
    console.log(`   Password: password123`);
    console.log(`   Role: ${manager.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating manager:', error.message);
    process.exit(1);
  }
};

createManager();
