const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// register new user
exports.register = async (req, res) => {
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

    // hash password before saving
    const hashed = await bcrypt.hash(password, 10);
    // always set role to employee for self-registration
    const user = await User.create({ name, email, password: hashed, role: 'employee' });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate required fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing email or password' });
    }

    // check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// get logged in user
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('Fetch user error:', err);
    return res.status(500).json({ success: false, message: 'Fetch user failed' });
  }
};