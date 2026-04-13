const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const existing = await findUserByEmail(email);
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const user = await createUser(email, password);
  res.json({ message: 'Registration successful', user: { id: user.id, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@dropforafrica.com';
  const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty123';
  const jwtSecret = process.env.JWT_SECRET || 'dropforafrica-secret';

  if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', email }, jwtSecret, { expiresIn: '2h' });
    return res.json({ token, user: { email } });
  }

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, email }, jwtSecret, { expiresIn: '2h' });
  res.json({ token, user: { id: user.id, email: user.email } });
});

module.exports = router;