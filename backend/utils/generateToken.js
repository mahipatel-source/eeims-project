const jwt = require('jsonwebtoken');

// generate JWT token for user
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
};

module.exports = generateToken;