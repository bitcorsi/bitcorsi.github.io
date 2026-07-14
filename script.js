// ============================================================
// LAB TECNOLOGICI - script.js (Versione Web3Forms - No Firebase)
// ============================================================

const ENROLLMENT_COURSES = {
  'spike':    { name: 'Spike Prime Lab',  age: '8-13 anni' },
  'arduino':  { name: 'Arduino base',      age: '12-16 anni' },
  'microbit': { name: 'Micro:bit Lab',     age: '8-13 anni' },
  'roberta':  { name: 'Open Roberta Lab',  age: '8-13 anni' },
  'robogrest':{ name: 'ROBOGREST 2026',    age: '7-13 anni' }
};

function init() {
  initMobileMenu();
  initFAQ();
  initEnrollmentModal();
  initScrollHeader();
  initRevealAnimations();
}

// ─── ANIMAZIONI REVEAL ───────────────────────────────────────────────────────
function initRevealAnimations() {
  const els = document.querySelectorAll('.section-header, .tool-card, .course-card, .scuola-card, .progetto-hl, .faq-list details, .hero-stepper-box');
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

// ─── MENU MOBILE ─────────────────────────────────────────────────────────────
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  const body = document.body;
  if (!menuToggle || !navOverlay) return;

  function closeMenu() {
    navOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navOverlay.classList.contains('active');
    if (isOpen) closeMenu();
    else {
      navOverlay.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
    }
  });

  navOverlay.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  navOverlay.addEventListener('click', (e) => { if (e.target === navOverlay) closeMenu(); });
}

// ─── FAQ ACCORDION ───────────────────────────────────────────────────────────
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-list details');
  faqItems.forEach(item => {
    item.addEventListener('toggle', function() {
      if (this.open) {
        faqItems.forEach(other => { if (other !== this && other.open) other.open = false; });
      }
    });
  });
}

// ─── MODALE ISCRIZIONI ───────────────────────────────────────────────────────
function initEnrollmentModal() {
  const modal = document.getElementById('enrollmentModal');
  const closeBtn = document.getElementById('closeEnrollmentModal');
  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeEnrollmentModal);
  
  const overlay = modal.querySelector('.enrollment-modal-overlay');
  if (overlay) overlay.addEventListener('click', closeEnrollmentModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeEnrollmentModal();
  });

  // Apri modal dai link "Unisciti a Noi" o pulsanti corso attivi
  document.querySelectorAll('a[href="#contatti-info"], .btn-course:not([disabled])').forEach(link => {
    link.addEventListener('click', (e) => {
      let courseId = null;
      if (link.classList.contains('btn-course')) {
        const card = link.closest('.course-card');
        if (card) {
          const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
          if (title.includes('robogrest')) courseId = 'robogrest';
          else if (title.includes('spike')) courseId = 'spike';
          else if (title.includes('micro:bit')) courseId = 'microbit';
          else if (title.includes('roberta')) courseId = 'roberta';
          else if (title.includes('arduino')) courseId = 'arduino';
        }
      }
      e.preventDefault();
      openEnrollmentModal(courseId);
    });
  });

  const form = document.getElementById('enrollmentForm');
  if (form) form.addEventListener('submit', handleEnrollmentSubmit);
}

function openEnrollmentModal(preselectCourseId) {
  const modal = document.getElementById('enrollmentModal');
  if (!modal) return;
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Reset messaggi e form
  const successMsg = document.getElementById('enrollmentSuccessMessage');
  const errorMsg = document.getElementById('enrollmentErrorMessage');
  const form = document.getElementById('enrollmentForm');
  
  if (successMsg) successMsg.style.display = 'none';
  if (errorMsg) errorMsg.style.display = 'none';
  if (form) {
    form.style.display = 'block';
    form.reset();
  }

  // Preselezione corso e logica settimane Robogrest
  if (preselectCourseId) {
    const corsoInput = document.getElementById('corsoSceltoInput');
    if (corsoInput) {
      const courseInfo = ENROLLMENT_COURSES[preselectCourseId];
      corsoInput.value = courseInfo ? courseInfo.name : preselectCourseId;
    }
    
    const weekSection = document.getElementById('robogrest-week-section');
    if (weekSection) {
      weekSection.style.display = preselectCourseId === 'robogrest' ? 'block' : 'none';
    }
  }
}

function closeEnrollmentModal() {
  const modal = document.getElementById('enrollmentModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// ─── SUBMIT FORM (Web3Forms AJAX) ────────────────────────────────────────────
async function handleEnrollmentSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('.enrollment-submit-btn');
  const submitText = document.getElementById('enrollmentSubmitText');
  const successMsg = document.getElementById('enrollmentSuccessMessage');
  const errorMsg = document.getElementById('enrollmentErrorMessage');

  // Reset messaggi
  if (successMsg) successMsg.style.display = 'none';
  if (errorMsg) errorMsg.style.display = 'none';

  // Validazione base
  const studentName = document.getElementById('studentName').value.trim();
  const studentAge = document.getElementById('studentAge').value;
  const parentEmail = document.getElementById('parentEmail').value.trim();
  const privacy = document.getElementById('privacy');

  if (!studentName) return showFormError('Inserisci il nome e cognome del bambino');
  if (!studentAge) return showFormError("Seleziona l'età del bambino");
  if (!parentEmail) return showFormError("Inserisci l'email del genitore");
  if (!privacy?.checked) return showFormError("Accetta l'informativa privacy per procedere");

  const isRobogrest = document.getElementById('corsoSceltoInput')?.value.includes('ROBOGREST');
  if (isRobogrest) {
    const weeks = document.querySelectorAll('input[name="Settimane_Robogrest[]"]:checked');
    if (weeks.length === 0) return showFormError('Seleziona almeno una settimana per Robogrest');
  }

  // Stato di caricamento
  if (submitBtn) submitBtn.disabled = true;
  if (submitText) submitText.textContent = '⏳ Invio in corso...';

  try {
    // Sincronizza il campo email nascosto per Web3Forms (per abilitare "Rispondi" diretto)
    const emailCopy = document.getElementById('parentEmailCopy');
    if (emailCopy) emailCopy.value = parentEmail;

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    });
    
    const result = await response.json();
    
    if (result.success) {
      if (form) form.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    } else {
      throw new Error(result.message || 'Errore sconosciuto durante l\'invio');
    }
  } catch (err) {
    console.error('Errore invio form:', err);
    showFormError(err.message || "Si è verificato un errore. Per favore, riprova o contattaci via WhatsApp.");
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (submitText) submitText.textContent = '✨ Invia Iscrizione';
  }
}

function showFormError(message) {
  const errorMsg = document.getElementById('enrollmentErrorMessage');
  const errorText = document.getElementById('enrollmentErrorText');
  if (errorText) errorText.innerText = message;
  if (errorMsg) {
    errorMsg.style.display = 'block';
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ─── SMART HIDE-ON-SCROLL HEADER ─────────────────────────────────────────────
function initScrollHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastY = window.scrollY;
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastY;
        
        if (currentY > header.offsetHeight) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        
        if (diff > 6 && currentY > 80) {
          header.classList.add('hidden');
        } else if (diff < -6 || currentY <= 80) {
          header.classList.remove('hidden');
        }
        
        lastY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Avvia tutto al caricamento del DOM
document.addEventListener('DOMContentLoaded', init);
