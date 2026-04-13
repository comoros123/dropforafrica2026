function getAdminToken() {
  return localStorage.getItem('adminToken');
}

function logoutAdmin() {
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
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

function renderStats(data) {
  document.getElementById('totalBookings').textContent = data.totalBookings || 0;
  document.getElementById('confirmedBookings').textContent = data.bookedSuccessful || 0;
  document.getElementById('commentCount').textContent = data.comments || 0;

  const tourSummary = document.getElementById('tourSummary');
  tourSummary.innerHTML = '';
  if (data.tourSummary && Object.keys(data.tourSummary).length) {
    Object.entries(data.tourSummary).forEach(([tour, count]) => {
      const badge = document.createElement('div');
      badge.className = 'recent-item';
      badge.innerHTML = `<h4>${tour}</h4><p>${count} bookings</p>`;
      tourSummary.appendChild(badge);
    });
  } else {
    tourSummary.innerHTML = '<p>No tour bookings yet.</p>';
  }

  const recentList = document.getElementById('recentList');
  recentList.innerHTML = '';
  if (data.recent && data.recent.length) {
    data.recent.forEach((booking) => {
      const item = document.createElement('div');
      item.className = 'recent-item';
      item.innerHTML = `
        <h4>${booking.name} — ${booking.tour}</h4>
        <p>${booking.message || 'No additional message'}</p>
        <span class="pill"><i class="fas fa-comment"></i> ${new Date(booking.createdAt).toLocaleDateString()}</span>
      `;
      recentList.appendChild(item);
    });
  } else {
    recentList.innerHTML = '<p>No recent bookings found.</p>';
  }

  renderBookingList(data.bookings || []);
}

function renderBookingList(bookings) {
  const allBookings = document.getElementById('allBookings');
  allBookings.innerHTML = '';
  if (!bookings.length) {
    allBookings.innerHTML = '<p>No booking records available yet.</p>';
    return;
  }

  bookings.forEach((booking) => {
    const item = document.createElement('div');
    item.className = 'recent-item';
    item.innerHTML = `
      <h4>${booking.name} — ${booking.tour || 'No tour selected'}</h4>
      <p><strong>Email:</strong> ${booking.email || 'N/A'}<br>
      <strong>Phone:</strong> ${booking.phone || 'N/A'}<br>
      <strong>Date:</strong> ${booking.date || 'Flexible'}<br>
      <strong>Message:</strong> ${booking.message || 'No message'}</p>
      <span class="pill">${new Date(booking.createdAt).toLocaleString()}</span>
    `;
    allBookings.appendChild(item);
  });
}

function buildBookingStats(bookings) {
  const tourSummary = bookings.reduce((summary, booking) => {
    if (!booking.tour) return summary;
    summary[booking.tour] = (summary[booking.tour] || 0) + 1;
    return summary;
  }, {});

  const recent = bookings.slice(0, 10);
  return {
    totalBookings: bookings.length,
    bookedSuccessful: bookings.filter((booking) => booking.status === 'confirmed').length,
    comments: bookings.filter((booking) => booking.message && booking.message.length).length,
    tourSummary,
    recent,
  };
}

async function fetchStats() {
  const token = getAdminToken();
  if (!token) return logoutAdmin();

  try {
    const response = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) return logoutAdmin();
    if (!response.ok) throw new Error('Unable to fetch stats');
    const data = await response.json();
    renderStats(data);
  } catch (error) {
    const bookings = getStoredBookings();
    const data = buildBookingStats(bookings);
    data.bookings = bookings;
    renderStats(data);
  }
}

document.getElementById('refreshButton')?.addEventListener('click', fetchStats);
fetchStats();
