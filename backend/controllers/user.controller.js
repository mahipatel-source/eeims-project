const bcrypt = require('bcryptjs');
const { User } = require('../models');

// get all users — admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
    return res.json({ success: true, data: users });
  } catch (err) {
    console.error('Get all users error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// get single user by id
exports.getUserById = async (req, res) => {
  try {
    const requestedId = parseInt(req.params.id);
    
    // non-admin users can only view their own profile
    if (req.user.role !== 'admin' && req.user.id !== requestedId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findByPk(requestedId, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

// get all employees — admin and manager
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: 'employee' },
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
    return res.json({ success: true, data: employees });
  } catch (err) {
    console.error('Get employees error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch employees' });
  }
};

// create new user — admin only
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    if (!['manager', 'technician'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be manager or technician' });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

// update user — admin only
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, role, password } = req.body;

    // hash new password if provided
    const updatedData = {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      updatedBy: req.user.id,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updatedData);

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

// delete user — admin only
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // First, set userId to null in related issues (soft approach)
    const { Issue } = require('../models');
    await Issue.update(
      { userId: null },
      { where: { userId: user.id } }
    );

    // Also set technicianId to null in related maintenance
    const { Maintenance } = require('../models');
    await Maintenance.update(
      { technicianId: null },
      { where: { technicianId: user.id } }
    );

    // Now hard delete the user
    await user.destroy({ force: true });

    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};
