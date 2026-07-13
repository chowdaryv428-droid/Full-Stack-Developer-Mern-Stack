// One-time helper script to create the first admin account.
// Run with: node seed.js
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const run = async () => {
  await connectDB();

  const email = 'admin@carecare.local';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  await User.create({
    name: 'System Admin',
    email,
    password: 'Admin@123',
    role: 'admin',
  });

  console.log('Admin account created:');
  console.log('  email:', email);
  console.log('  password: Admin@123');
  console.log('Please log in and change this password.');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
