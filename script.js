/* ============================================
   PORTFOLIO - SCRIPT.JS
   Handles: Navbar, hamburger menu, scroll reveals,
            skill bar animations, active nav state
   ============================================ */

// ── Navbar scroll effect ──────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Hamburger / Mobile Menu ───────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Active Nav Link ───────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Scroll Reveal Animation ───────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Skill Bar Animation ───────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.bar-fill');
      fills.forEach(fill => {
        const pct = fill.getAttribute('data-pct');
        setTimeout(() => { fill.style.width = pct + '%'; }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const barSection = document.querySelector('.skill-bars');
if (barSection) barObserver.observe(barSection);

// ── Staggered card reveals ────────────────────
document.querySelectorAll('.blog-card, .skill-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
  card.classList.add('reveal');
  revealObserver.observe(card);
});

// ── Cursor glow effect (desktop only) ────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:300px;height:300px;pointer-events:none;z-index:9998;
    border-radius:50%;background:radial-gradient(circle,rgba(212,168,83,0.04) 0%,transparent 70%);
    transform:translate(-50%,-50%);transition:transform 0.15s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ── Contact Form Logic (contact.html) ─────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const subjectSel   = document.getElementById('subject');
  const messageArea  = document.getElementById('message');
  const charCount    = document.getElementById('charCount');
  const submitBtn    = document.getElementById('submitBtn');
  const formWrap     = document.getElementById('formWrap');
  const successMsg   = document.getElementById('successMsg');

  // Character counter for textarea
  if (messageArea && charCount) {
    messageArea.addEventListener('input', () => {
      const len = messageArea.value.length;
      charCount.textContent = `${len} / 500`;
      charCount.style.color = len > 450 ? '#e05555' : 'var(--muted)';
    });
  }

  // Inline validation helpers
  function showError(input, msgEl, text) {
    input.classList.add('error');
    msgEl.textContent = text;
    msgEl.classList.add('show');
  }
  function clearError(input, msgEl) {
    input.classList.remove('error');
    msgEl.classList.remove('show');
  }

  // Live validation on blur
  nameInput.addEventListener('blur', () => {
    const errEl = document.getElementById('nameError');
    if (!nameInput.value.trim()) showError(nameInput, errEl, 'Please enter your name.');
    else if (nameInput.value.trim().length < 2) showError(nameInput, errEl, 'Name must be at least 2 characters.');
    else clearError(nameInput, errEl);
  });

  emailInput.addEventListener('blur', () => {
    const errEl = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) showError(emailInput, errEl, 'Please enter your email address.');
    else if (!emailRegex.test(emailInput.value)) showError(emailInput, errEl, 'Please enter a valid email address.');
    else clearError(emailInput, errEl);
  });

  messageArea.addEventListener('blur', () => {
    const errEl = document.getElementById('messageError');
    if (!messageArea.value.trim()) showError(messageArea, errEl, 'Please enter your message.');
    else if (messageArea.value.trim().length < 15) showError(messageArea, errEl, 'Message must be at least 15 characters.');
    else clearError(messageArea, errEl);
  });

  // Full validation on submit
  function validateForm() {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nameErr = document.getElementById('nameError');
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, nameErr, 'Please enter your full name (min 2 chars).');
      valid = false;
    } else clearError(nameInput, nameErr);

    const emailErr = document.getElementById('emailError');
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
      showError(emailInput, emailErr, 'Please enter a valid email address.');
      valid = false;
    } else clearError(emailInput, emailErr);

    const subjectErr = document.getElementById('subjectError');
    if (!subjectSel.value) {
      subjectSel.classList.add('error');
      subjectErr.textContent = 'Please select a subject.';
      subjectErr.classList.add('show');
      valid = false;
    } else {
      subjectSel.classList.remove('error');
      subjectErr.classList.remove('show');
    }

    const msgErr = document.getElementById('messageError');
    if (!messageArea.value.trim() || messageArea.value.trim().length < 15) {
      showError(messageArea, msgErr, 'Please write a message (min 15 characters).');
      valid = false;
    } else clearError(messageArea, msgErr);

    return valid;
  }

  // Submit handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Loading state
    submitBtn.classList.add('loading');

    // Simulate async send (1.8 seconds)
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      // Hide form, show success
      formWrap.style.display = 'none';
      successMsg.classList.add('show');
      // Update success message with user's name
      const firstName = nameInput.value.trim().split(' ')[0];
      document.getElementById('successName').textContent = firstName + '!';
    }, 1800);
  });
}
