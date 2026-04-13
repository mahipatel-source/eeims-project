const { User } = require('../models');

// check if logged in user has required role
exports.authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    let normalizedRole = typeof req.user.role === 'string'
      ? req.user.role.trim().toLowerCase()
      : req.user.role;

    if (!normalizedRole && req.user?.id) {
      const user = await User.findByPk(req.user.id, { attributes: ['role'] });
      normalizedRole = user && typeof user.role === 'string'
        ? user.role.trim().toLowerCase()
        : user?.role;
      req.user.role = normalizedRole;
    }

    const allowedRoles = roles.map((role) => role.trim().toLowerCase());

    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied — insufficient permissions',
      });
    }
    next();
  };
};