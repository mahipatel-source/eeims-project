const bcrypt = require('bcryptjs');
const { User } = require('../models');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@eeims.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const existingAdmin = await User.findOne({ where: { role: 'admin' } });

    if (existingAdmin) {
      console.log('✅ Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log(`✅ Admin created: ${adminEmail}`);
  } catch (err) {
    console.error('❌ Admin seeder error:', err.message);
  }
};

module.exports = seedAdmin;