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
let bookingData = { service: null };

function resetBooking() {
  bookingData = { service: null };
  goToStep(1);
  document.querySelectorAll('.booking-service-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('next-1').disabled = true;
}

function goToStep(n) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');

  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === n) dot.classList.add('active');
    else if (i + 1 < n) dot.classList.add('done');
  });

  // Reinitialize Calendly widget when reaching step 2
  if (n === 2 && window.Calendly) {
    const widget = document.getElementById('calendlyWidget');
    widget.innerHTML = '';
    Calendly.initInlineWidget({
      url: `https://calendly.com/zia-chest/30min?hide_event_type_details=1&primary_color=c9a84c`,
      parentElement: widget,
    });
  }
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

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    goToStep(parseInt(btn.getAttribute('data-target')));
  });
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