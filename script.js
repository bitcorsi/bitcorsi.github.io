// ============================================================
// BITCODE - script.js (Versione Web3Forms - No Firebase)
// Refactor: best practice, stessa struttura HTML/CSS, stesso comportamento
// ============================================================

(function () {
  'use strict';

  let lastFocusedElement = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileMenu();
    initFAQ();
    initEnrollmentModal();
    initScrollHeader();
    initRevealAnimations();
  }

  // ─── ANIMAZIONI REVEAL ─────────────────────────────────────────────────
  function initRevealAnimations() {
    const els = document.querySelectorAll(
      '.section-intro, .step, .course, .festa, .scuola, .review, .faq details'
    );
    els.forEach((el) => el.classList.add('reveal'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el) => io.observe(el));
  }

  // ─── MENU MOBILE ───────────────────────────────────────────────────────
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const body = document.body;
    if (!menuToggle || !navMobile) return;

    function closeMenu() {
      navMobile.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }

    function openMenu() {
      navMobile.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
    }

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMobile.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });

    navMobile.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ─── FAQ ACCORDION ─────────────────────────────────────────────────────
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq details');
    faqItems.forEach((item) => {
      item.addEventListener('toggle', function () {
        if (this.open) {
          faqItems.forEach((other) => {
            if (other !== this && other.open) other.open = false;
          });
        }
      });
    });
  }

  // ─── MODALE ISCRIZIONI ─────────────────────────────────────────────────
  function initEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal');
    if (!modal) return;

    const closeBtn = document.getElementById('closeEnrollmentModal');
    const overlay = modal.querySelector('.enrollment-modal-overlay');
    const form = document.getElementById('enrollmentForm');
    const corsoSelect = document.getElementById('corsoSelect');
    const corsoInput = document.getElementById('corsoSceltoInput');
    const weekSection = document.getElementById('robogrest-week-section');

    if (closeBtn) closeBtn.addEventListener('click', closeEnrollmentModal);
    if (overlay) overlay.addEventListener('click', closeEnrollmentModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') closeEnrollmentModal();
    });

    if (corsoSelect) {
      corsoSelect.addEventListener('change', function () {
        if (corsoInput) corsoInput.value = this.value;
        if (weekSection) {
          weekSection.style.display = this.value.includes('ROBOGREST') ? 'block' : 'none';
        }
      });
    }

    // CTA generiche ("Prenota una prova", pulsante nel form contatti) — aprono il modale senza corso preselezionato
    document.querySelectorAll('.js-open-modal').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openEnrollmentModal(null);
      });
    });

    // Pulsanti "Iscriviti / Avvisami" nelle card corso — aprono il modale con il corso già selezionato
    document.querySelectorAll('.course-link[data-course]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openEnrollmentModal(link.dataset.course);
      });
    });

    if (form) form.addEventListener('submit', handleEnrollmentSubmit);
  }

  function openEnrollmentModal(preselectCourseName) {
    const modal = document.getElementById('enrollmentModal');
    if (!modal) return;

    lastFocusedElement = document.activeElement;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const successMsg = document.getElementById('enrollmentSuccessMessage');
    const errorMsg = document.getElementById('enrollmentErrorMessage');
    const form = document.getElementById('enrollmentForm');

    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
    if (form) {
      form.style.display = 'block';
      form.reset();
    }

    const corsoSelect = document.getElementById('corsoSelect');
    const corsoInput = document.getElementById('corsoSceltoInput');

    if (preselectCourseName && corsoSelect) {
      corsoSelect.value = preselectCourseName;
      if (corsoInput) corsoInput.value = corsoSelect.value;
    }

    const weekSection = document.getElementById('robogrest-week-section');
    if (weekSection) {
      weekSection.style.display = (preselectCourseName || '').includes('ROBOGREST') ? 'block' : 'none';
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const firstField = document.getElementById('studentName');
    if (firstField && !isMobile) {
      setTimeout(() => firstField.focus(), 350);
    }
  }

  function closeEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal');
    const successMsg = document.getElementById('enrollmentSuccessMessage');

    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
    if (successMsg) successMsg.style.display = 'none';

    document.body.style.overflow = 'auto';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  // ─── SUBMIT FORM (Web3Forms AJAX) ──────────────────────────────────────
  async function handleEnrollmentSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.enrollment-submit-btn');
    const submitText = document.getElementById('enrollmentSubmitText');
    const successMsg = document.getElementById('enrollmentSuccessMessage');
    const errorMsg = document.getElementById('enrollmentErrorMessage');
    const modal = document.getElementById('enrollmentModal');

    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';

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

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = '⏳ Invio in corso...';

    try {
      const emailCopy = document.getElementById('parentEmailCopy');
      if (emailCopy) emailCopy.value = parentEmail;

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        if (modal) modal.style.display = 'none';
        if (form) form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'flex';
        form.reset();
      } else {
        throw new Error(result.message || "Errore sconosciuto durante l'invio");
      }
    } catch (err) {
      console.error('Errore invio form:', err);
      showFormError(err.message || 'Si è verificato un errore. Per favore, riprova o contattaci via WhatsApp.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = '✨ Invia Iscrizione';
    }
  }

  function showFormError(message) {
    const errorMsg = document.getElementById('enrollmentErrorMessage');
    const errorText = document.getElementById('enrollmentErrorText');
    if (errorText) errorText.textContent = message;
    if (errorMsg) {
      errorMsg.style.display = 'block';
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // ─── SMART HIDE-ON-SCROLL HEADER ───────────────────────────────────────
  function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const diff = currentY - lastY;

          header.classList.toggle('scrolled', currentY > header.offsetHeight);

          if (diff > 6 && currentY > 80) {
            header.classList.add('hidden');
          } else if (diff < -6 || currentY <= 80) {
            header.classList.remove('hidden');
          }

          lastY = currentY;
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  window.closeEnrollmentModal = closeEnrollmentModal;
})();