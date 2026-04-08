const bcrypt = require('bcryptjs');
require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/User');

const hashPlaintextPasswords = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const users = await User.findAll();
    let updatedCount = 0;

    for (const user of users) {
      if (user.password && !user.password.startsWith('$2')) {
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        updatedCount += 1;
        console.log(`• Updated password for ${user.email}`);
      }
    }

    if (!updatedCount) {
      console.log('No plaintext passwords found.');
    } else {
      console.log(`✅ Updated ${updatedCount} plaintext password(s)`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to hash plaintext passwords:', error);
    process.exit(1);
  }
};

hashPlaintextPasswords();
