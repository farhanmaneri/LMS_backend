const User = require('../models/User');

const createUser = async (req, res) => {
  const { email, password, role, name } = req.body;
  if (role === 'admin') return res.status(403).json({ message: 'Cannot create another admin' });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User exists' });

  const user = new User({ email, password, role , name});
  await user.save();
  res.json({ message: 'User created', user: { email, role } });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password -resetToken -resetTokenExpiry"
    ); // Exclude sensitive fields
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser, getAllUsers };
