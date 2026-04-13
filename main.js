const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const toast = document.getElementById('toast');

menuToggle?.addEventListener('click', () => {
  menu?.classList.toggle('open');
});

document.addEventListener('click', (event) => {
  if (!menu || !menuToggle) return;
  const target = event.target;
  if (menu.classList.contains('open') && !menu.contains(target) && !menuToggle.contains(target)) {
    menu.classList.remove('open');
  }
});

function showToast(message, success = true) {
  if (!toast) return;
  toast.textContent = message;
  toast.style.background = success ? 'rgba(28, 79, 52, 0.95)' : 'rgba(138, 40, 40, 0.95)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function getStoredBookings() {
  const raw = localStorage.getItem('dfa_bookings');
  if (!raw) return [];
  try {
    return JSON.parse(raw) || [];
  } catch (error) {
    localStorage.removeItem('dfa_bookings');
    return [];
  }
}

function saveBookingLocally(booking) {
  const bookings = getStoredBookings();
  bookings.unshift(booking);
  localStorage.setItem('dfa_bookings', JSON.stringify(bookings.slice(0, 200)));
  return bookings;
}

function getBookingStats(bookings) {
  return {
    totalBookings: bookings.length,
    bookedSuccessful: bookings.filter((booking) => booking.status === 'confirmed').length,
    comments: bookings.filter((booking) => booking.message && booking.message.length).length,
  };
}

async function updateLiveStats() {
  const liveBookings = document.getElementById('liveBookings');
  if (!liveBookings) return;
  try {
    const response = await fetch('/api/bookings/stats');
    if (!response.ok) throw new Error('No stats available');
    const data = await response.json();
    liveBookings.textContent = data.totalBookings || 0;
  } catch (error) {
    const stats = getBookingStats(getStoredBookings());
    liveBookings.textContent = stats.totalBookings;
  }
}

function applyTourQuery() {
  const params = new URLSearchParams(window.location.search);
  const tour = params.get('tour');
  if (!tour) return;

  const tourField = document.querySelector('select[name="tour"]');
  if (tourField) {
    tourField.value = tour;
  }

  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

async function submitBooking(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    tour: formData.get('tour'),
    date: formData.get('date'),
    message: formData.get('message'),
  };

  const localBooking = {
    ...payload,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Booking failed');
    }
    showToast('Booking confirmed! We will contact you shortly.');
    form.reset();
    updateLiveStats();
  } catch (error) {
    saveBookingLocally(localBooking);
    showToast('Booking saved locally because backend is unavailable.', true);
    form.reset();
    updateLiveStats();
  }
}

const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', submitBooking);
updateLiveStats();
applyTourQuery();
