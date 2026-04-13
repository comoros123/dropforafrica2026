require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
