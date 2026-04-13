# Drop for Africa

A modern marketing website for Drop for Africa with a reactive Node backend, booking API, admin dashboard, and optional Python support scripts.

## Features
- Updated modern front-end design with premium tour marketing copy
- Reactive booking form posting to `backend/api/bookings`
- Admin dashboard at `admin.html` with live booking and comment statistics
- Local JSON booking storage in `backend/data/bookings.json`
- Python helper scripts for marketing text and booking analytics

## Run locally
1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:5000` in your browser.

## Admin page
Visit `http://localhost:5000/admin.html` for dashboard statistics.

## Python helpers
- `scripts/marketing_copy.py` generates marketing copy for tours.
- `scripts/booking_analytics.py` prints booking statistics from `backend/data/bookings.json`.

## Notes
- The backend serves static files from the project root and exposes the booking API.
- `backend/routes/bookings.js` is the new reactive booking endpoint.
