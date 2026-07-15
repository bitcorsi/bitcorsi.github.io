// ============================================================
// LAB TECNOLOGICI - script.js (Versione Web3Forms - No Firebase)
// Refactor: best practice, stessa struttura HTML/CSS, stesso comportamento
// ============================================================

(function () {
  'use strict';

  const ENROLLMENT_COURSES = {
    spike:     { name: 'Spike Prime Lab', age: '8-13 anni' },
    arduino:   { name: 'Arduino base',    age: '12-16 anni' },
    microbit:  { name: 'Micro:bit Lab',   age: '8-13 anni' },
    roberta:   { name: 'Open Roberta Lab',age: '8-13 anni' },
    robogrest: { name: 'ROBOGREST 2026',  age: '7-13 anni' }
  };

  // Riferimento all'elemento che aveva il focus prima di aprire il modale,
  // per poterlo ripristinare alla chiusura (accessibilità tastiera/screen reader).
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
      '.section-header, .tool-card, .course-card, .scuola-card, .progetto-hl, .faq-list details, .hero-stepper-box'
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
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;
    if (!menuToggle || !navOverlay) return;

    function closeMenu() {
      navOverlay.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }

    function openMenu() {
      navOverlay.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
    }

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navOverlay.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });

    navOverlay.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    navOverlay.addEventListener('click', (e) => {
      if (e.target === navOverlay) closeMenu();
    });
  }

  // ─── FAQ ACCORDION ─────────────────────────────────────────────────────
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-list details');
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

    // Aggiorna il campo nascosto e la sezione settimane quando cambia il corso scelto manualmente
    if (corsoSelect) {
      corsoSelect.addEventListener('change', function () {
        if (corsoInput) corsoInput.value = this.value;
        if (weekSection) {
          weekSection.style.display = this.value.includes('ROBOGREST') ? 'block' : 'none';
        }
      });
    }

    // Apri il modale dai link "Unisciti a Noi" o dai pulsanti corso attivi
    document.querySelectorAll('a[href="#contatti-info"], .btn-course:not([disabled])').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openEnrollmentModal(resolveCourseIdFromLink(link));
      });
    });

    if (form) form.addEventListener('submit', handleEnrollmentSubmit);
  }

  /**
   * Determina l'id del corso (chiave di ENROLLMENT_COURSES) a partire
   * dal titolo mostrato nella card del corso, se il link cliccato è un bottone corso.
   */
  function resolveCourseIdFromLink(link) {
    if (!link.classList.contains('btn-course')) return null;

    const card = link.closest('.course-card');
    const title = card ? card.querySelector('.course-title')?.textContent.toLowerCase() || '' : '';

    if (title.includes('robogrest')) return 'robogrest';
    if (title.includes('spike')) return 'spike';
    if (title.includes('micro:bit')) return 'microbit';
    if (title.includes('roberta')) return 'roberta';
    if (title.includes('arduino')) return 'arduino';
    return null;
  }

  function openEnrollmentModal(preselectCourseId) {
    const modal = document.getElementById('enrollmentModal');
    if (!modal) return;

    lastFocusedElement = document.activeElement;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset messaggi
    const successMsg = document.getElementById('enrollmentSuccessMessage');
    const errorMsg = document.getElementById('enrollmentErrorMessage');
    const form = document.getElementById('enrollmentForm');

    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
    if (form) {
      form.style.display = 'block';
      form.reset();
    }

    // Preselezione corso nel dropdown
    const corsoSelect = document.getElementById('corsoSelect');
    const corsoInput = document.getElementById('corsoSceltoInput');

    if (preselectCourseId && corsoSelect) {
      const courseInfo = ENROLLMENT_COURSES[preselectCourseId];
      corsoSelect.value = courseInfo ? courseInfo.name : preselectCourseId;
      if (corsoInput) corsoInput.value = corsoSelect.value;
    }

    // Mostra/nascondi settimane Robogrest
    const weekSection = document.getElementById('robogrest-week-section');
    if (weekSection) {
      weekSection.style.display = preselectCourseId === 'robogrest' ? 'block' : 'none';
    }

    // Sposta il focus dentro il modale per l'accessibilità da tastiera
    const firstField = document.getElementById('studentName');
    if (firstField) firstField.focus();
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

    // Ripristina il focus sull'elemento che aveva aperto il modale
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
        // Chiude il modale sottostante per evitare il doppio overlay,
        // e mostra solo la card di conferma a schermo intero.
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

  // L'HTML richiama closeEnrollmentModal() tramite onclick inline
  // (overlay del modale e bottone "Perfetto, grazie!"): la esponiamo
  // volutamente in globale per restare compatibili senza toccare l'HTML.
  window.closeEnrollmentModal = closeEnrollmentModal;
})();
