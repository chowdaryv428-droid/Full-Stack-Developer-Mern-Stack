const User = require('../models/User');

// GET /api/users  (admin only) - list all users, optional ?role=agent filter
exports.listUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ users: users.map((u) => u.toSafeObject()) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// POST /api/users (admin only) - create an agent/admin/customer account directly
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, address, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    const user = await User.create({
      name,
      email,
      phone,
      password,
      address,
      role: role || 'customer',
    });
    res.status(201).json({ message: 'User created', user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

// GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// PUT /api/users/:id - update own profile, or any profile if admin
exports.updateUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const isSelf = String(req.user._id) === String(targetId);
    if (!isSelf && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit your own profile' });
    }

    const allowedFields = ['name', 'phone', 'address', 'customFields'];
    if (req.user.role === 'admin') {
      allowedFields.push('role', 'isActive');
    }

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(targetId, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated', user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

// DELETE /api/users/:id (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};
