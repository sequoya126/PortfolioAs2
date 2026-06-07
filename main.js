// ═══════════════════════════════════
//   ZIA'S CHEST — main.js
// ═══════════════════════════════════

// ── Header scroll effect ──
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Modal system ──
function openModal(id) {
  const el = document.getElementById('modal-' + id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(el) {
  el.classList.remove('open');
  document.body.style.overflow = '';
}

// Nav items open modals
document.querySelectorAll('[data-modal]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const id = trigger.getAttribute('data-modal');
    if (id === 'booking') resetBooking();
    openModal(id);
  });
});

// Close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(btn.closest('.modal-overlay'));
  });
});

// Click outside panel closes modal
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});

// ── Booking flow ──
let bookingData = { service: null, date: null, time: null, notes: null, firstName: null, lastName: null, email: null, phone: null };

function resetBooking() {
  bookingData = { service: null, date: null, time: null, notes: null, firstName: null, lastName: null, email: null, phone: null };
  goToStep(1);
  document.querySelectorAll('.booking-service-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('next-1').disabled = true;
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = '';
  }
  const timeSelect = document.getElementById('booking-time');
  if (timeSelect) timeSelect.value = '';
  ['booking-firstname','booking-lastname','booking-email','booking-phone','booking-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function goToStep(n) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');

  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === n) dot.classList.add('active');
    else if (i + 1 < n) dot.classList.add('done');
  });
}

// Service selection
document.querySelectorAll('.booking-service-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.booking-service-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    bookingData.service = card.getAttribute('data-service');
    document.getElementById('next-1').disabled = false;
  });
});

// Step 1 → 2
document.getElementById('next-1').addEventListener('click', () => goToStep(2));

// Step 2 validation
function validateStep2() {
  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;
  document.getElementById('next-2').disabled = !(date && time);
}
document.getElementById('booking-date').addEventListener('change', validateStep2);
document.getElementById('booking-time').addEventListener('change', validateStep2);

document.getElementById('next-2').addEventListener('click', () => {
  bookingData.date = document.getElementById('booking-date').value;
  bookingData.time = document.getElementById('booking-time').value;
  bookingData.notes = document.getElementById('booking-notes').value;
  goToStep(3);
});

// Step 3 validation
function validateStep3() {
  const fn = document.getElementById('booking-firstname').value.trim();
  const ln = document.getElementById('booking-lastname').value.trim();
  const em = document.getElementById('booking-email').value.trim();
  document.getElementById('next-3').disabled = !(fn && ln && em.includes('@'));
}
['booking-firstname','booking-lastname','booking-email'].forEach(id => {
  document.getElementById(id).addEventListener('input', validateStep3);
});

document.getElementById('next-3').addEventListener('click', () => {
  bookingData.firstName = document.getElementById('booking-firstname').value.trim();
  bookingData.lastName  = document.getElementById('booking-lastname').value.trim();
  bookingData.email     = document.getElementById('booking-email').value.trim();
  bookingData.phone     = document.getElementById('booking-phone').value.trim();

  // Build summary
  const formattedDate = new Date(bookingData.date + 'T12:00:00').toLocaleDateString('en-CA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  document.getElementById('confirmSummary').innerHTML = `
    <strong>Service:</strong> ${bookingData.service}<br>
    <strong>Date:</strong> ${formattedDate}<br>
    <strong>Time:</strong> ${bookingData.time}<br>
    <strong>Name:</strong> ${bookingData.firstName} ${bookingData.lastName}<br>
    <strong>Email:</strong> ${bookingData.email}<br>
    ${bookingData.phone ? `<strong>Phone:</strong> ${bookingData.phone}<br>` : ''}
    ${bookingData.notes ? `<strong>Notes:</strong> ${bookingData.notes}` : ''}
  `;
  goToStep(4);
});

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    goToStep(parseInt(btn.getAttribute('data-target')));
  });
});

// Confirm button
document.getElementById('confirmBtn').addEventListener('click', () => {
  document.getElementById('confirmSummary').innerHTML = `
    <div style="text-align:center; padding: 1rem 0;">
      <div style="font-size:2rem; margin-bottom:0.5rem;">✦</div>
      <strong>Request sent!</strong><br>
      Zia will be in touch at <em>${bookingData.email}</em> within 48 hours.
    </div>
  `;
  document.getElementById('confirmBtn').style.display = 'none';
  document.querySelector('.confirm-note').style.display = 'none';
});

// ── Gallery tap counter & modal ──
const track = document.getElementById('galleryTrack');
const photoModal = document.getElementById('photoModal');
let count = 0;
const counterDisplay = document.getElementById('tapCounter');

track.addEventListener('click', (e) => {
  count++;
  counterDisplay.innerText = count;

  const item = e.target.closest('.photo-item');
  if (!item || !item.getAttribute('data-title')) return;

  document.getElementById('modalTitle').innerText  = item.getAttribute('data-title');
  document.getElementById('modalPrice').innerText  = item.getAttribute('data-price');
  document.getElementById('modalDesc').innerText   = item.getAttribute('data-desc');
  document.getElementById('modalImage').style.backgroundColor = item.style.backgroundColor;

  track.style.animationPlayState = 'paused';
  photoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});

document.getElementById('closeBtn').addEventListener('click', () => {
  photoModal.classList.remove('open');
  document.body.style.overflow = '';
  track.style.animationPlayState = 'running';
});

photoModal.addEventListener('click', (e) => {
  if (e.target === photoModal) {
    photoModal.classList.remove('open');
    document.body.style.overflow = '';
    track.style.animationPlayState = 'running';
  }
});

// ── Cursor glow ──
const cursor = document.querySelector('.cursor-glow');
let mouseX = 0, mouseY = 0, posX = 0, posY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  posX += (mouseX - posX) * 0.1;
  posY += (mouseY - posY) * 0.1;
  cursor.style.left = posX + 'px';
  cursor.style.top  = posY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();