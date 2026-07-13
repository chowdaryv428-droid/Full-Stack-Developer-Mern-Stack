const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Only allow 'customer' role at public signup.
    // Admins/agents should be created by an existing admin via /api/users (protected route).
    const safeRole = role === 'admin' || role === 'agent' ? 'customer' : (role || 'customer');

    const user = await User.create({ name, email, phone, password, address, role: safeRole });
    const token = signToken(user);

    res.status(201).json({
      message: 'Account created successfully. You can now log in.',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated' });
    }

    const token = signToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};
