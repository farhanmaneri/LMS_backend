const User = require('../models/user');

const createUser = async (req, res) => {
  const { email, password, role } = req.body;
  if (role === 'admin') return res.status(403).json({ message: 'Cannot create another admin' });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User exists' });

  const user = new User({ email, password, role });
  await user.save();
  res.json({ message: 'User created', user: { email, role } });
};
module.exports= {createUser}