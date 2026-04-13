const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/bookings.json');
const secret = process.env.JWT_SECRET || 'dropforafrica-secret';

async function readData() {
  try {
    const content = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { bookings: [] };
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authorization required' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

router.get('/stats', authMiddleware, async (req, res) => {
  const data = await readData();
  const bookings = data.bookings || [];
  const tourSummary = bookings.reduce((summary, booking) => {
    summary[booking.tour] = (summary[booking.tour] || 0) + 1;
    return summary;
  }, {});

  const comments = bookings.filter((booking) => booking.message && booking.message.length).length;

  res.json({
    totalBookings: bookings.length,
    bookedSuccessful: bookings.filter((booking) => booking.status === 'confirmed').length,
    comments,
    tourSummary,
    recent: bookings.slice(0, 6),
    bookings,
  });
});

module.exports = router;
