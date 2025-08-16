const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/generateToken');

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
