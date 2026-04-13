const jwt = require('jsonwebtoken');
const { User } = require('../models');

// verify JWT token from request header
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check if token exists in header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // extract and verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let normalizedRole = typeof decoded.role === 'string'
      ? decoded.role.trim().toLowerCase()
      : decoded.role;

    // recover role from DB if the token does not include it
    if (!normalizedRole && decoded.id) {
      const user = await User.findByPk(decoded.id, { attributes: ['role'] });
      normalizedRole = user && typeof user.role === 'string'
        ? user.role.trim().toLowerCase()
        : user?.role;
    }

    // attach normalized user info to request
    req.user = { ...decoded, role: normalizedRole };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};