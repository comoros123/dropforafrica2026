const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/bookings.json');

async function readData() {
  try {
    const content = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { bookings: [] };
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

router.post('/', async (req, res) => {
  const { name, email, phone, tour, date, message } = req.body;
  if (!name || !email || !phone || !tour) {
    return res.status(400).json({ message: 'Please provide name, email, phone, and tour.' });
  }

  const booking = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    tour,
    date: date || 'Flexible dates',
    message: message?.trim() || '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  const data = await readData();
  data.bookings.unshift(booking);
  await writeData(data);

  res.status(201).json({ message: 'Booking confirmed', booking });
});

router.get('/stats', async (req, res) => {
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
  });
});

module.exports = router;
