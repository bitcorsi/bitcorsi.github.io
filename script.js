/* ==========================================================================
   BITCODE — script.js
   Vanilla JS · nessuna dipendenza · un solo IIFE, un solo listener per evento
   ========================================================================== */

(function () {
  'use strict';

  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  const SUBMIT_TIMEOUT_MS = 15000;
  const SPIKE_COURSE = 'Spike Prime Lab';
  const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

  let lastFocusedElement = null;
  let focusTimer = null;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const isVisible = (el) => Boolean(el) && getComputedStyle(el).display !== 'none';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileMenu();
    initHeader();
    initScrollSpy();
    initParallax();
    initRevealAnimations();
    initFAQ();
    initToolSelector();
    initEnrollmentModal();
    initSedeLogic();
  }

  /* 01 · MENU MOBILE ------------------------------------------------------- */

  function initMobileMenu() {
    const toggle = $('.menu-toggle');
    const menu = $('#navMobile');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpen(!menu.classList.contains('active'));
    });

    $$('a', menu).forEach((link) => link.addEventListener('click', () => setOpen(false)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('active')) setOpen(false);
    });
  }

  /* 02 · HEADER (sempre visibile, solo stile allo scroll) ------------------- */

  function initHeader() {
    const header = $('.header');
    if (!header) return;

    let headerHeight = header.offsetHeight;
    let ticking = false;

    const update = () => {
      header.classList.toggle('scrolled', window.scrollY > headerHeight);
      ticking = false;
    };

    window.addEventListener('resize', () => { headerHeight = header.offsetHeight; }, { passive: true });
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* 03 · SCROLLSPY --------------------------------------------------------- */

  function initScrollSpy() {
    const links = $$('.nav-desktop a[href^="#"], .nav-mobile a[href^="#"]')
      .filter((link) => !link.classList.contains('js-open-modal'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    const byId = new Map();
    links.forEach((link) => {
      const id = link.getAttribute('href').slice(1);
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(link);
    });

    const sections = [...byId.keys()]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const setCurrent = (id) => {
      links.forEach((link) => {
        const active = Boolean(id) && link.getAttribute('href') === `#${id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const observer = new IntersectionObserver((entries) => {
      if (window.scrollY < 100) { setCurrent(null); return; }
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length) setCurrent(visible[visible.length - 1].target.id);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', () => {
      if (window.scrollY < 100) setCurrent(null);
    }, { passive: true });
  }

  /* 04 · PARALLAX HERO (disattivato con reduced motion) --------------------- */

  function initParallax() {
    const visual = $('.hero-visual');
    if (!visual) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 961px)');
    let ticking = false;

    const update = () => {
      const enabled = !reduceMotion.matches && wide.matches;
      const offset = enabled ? Math.min(window.scrollY * 0.08, 48) : 0;
      visual.style.setProperty('--parallax', `${offset}px`);
      ticking = false;
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    reduceMotion.addEventListener('change', request);
    wide.addEventListener('change', request);
    update();
  }

  /* 05 · REVEAL ------------------------------------------------------------ */

  function initRevealAnimations() {
    const elements = $$('.section-intro, .step, .pcard, .scuola, .review, .faq details');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    elements.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    elements.forEach((el) => observer.observe(el));
  }

  /* 06 · FAQ (accordion esclusivo) ------------------------------------------ */

  function initFAQ() {
    const items = $$('.faq details');
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      });
    });
  }

  /* 07 · TAB STRUMENTI ------------------------------------------------------ */

  function initToolSelector() {
    const tabs = $$('.tl-list [role="tab"]');
    const panels = $$('.tl-panel');
    if (!tabs.length) return;

    const select = (index, moveFocus = false) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel, i) => { panel.hidden = i !== index; });
      if (moveFocus) tabs[index].focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', (event) => {
        const count = tabs.length;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          select((index + 1) % count, true);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          select((index + count - 1) % count, true);
        } else if (event.key === 'Home') {
          event.preventDefault();
          select(0, true);
        } else if (event.key === 'End') {
          event.preventDefault();
          select(count - 1, true);
        }
      });
    });

    select(0);
  }

  /* 08 · MODALE ISCRIZIONE -------------------------------------------------- */

  function initEnrollmentModal() {
    const modal = $('#enrollmentModal');
    if (!modal) return;

    const closeButton = $('#closeEnrollmentModal');
    const overlay = $('.enrollment-modal-overlay', modal);
    const form = $('#enrollmentForm');
    const success = $('#enrollmentSuccessMessage');
    const successClose = $('#enrollmentSuccessClose');
    const courseSelect = $('#corsoSelect');
    const courseCopy = $('#corsoSceltoInput');
    const weekSection = $('#robogrest-week-section');

    if (closeButton) closeButton.addEventListener('click', closeEnrollmentModal);
    if (overlay) overlay.addEventListener('click', closeEnrollmentModal);
    if (successClose) successClose.addEventListener('click', closeEnrollmentModal);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && (isVisible(success) || isVisible(modal))) {
        closeEnrollmentModal();
      }
      if (event.key === 'Tab') trapFocus(event, modal, success);
    });

    if (courseSelect) {
      courseSelect.addEventListener('change', () => {
        if (courseCopy) courseCopy.value = courseSelect.value;
        if (weekSection) {
          weekSection.style.display = courseSelect.value.includes('ROBOGREST') ? 'block' : 'none';
        }
      });
    }

    $$('.js-open-modal').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openEnrollmentModal(null);
      });
    });

    $$('.course-link[data-course]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openEnrollmentModal(link.dataset.course);
      });
    });

    if (form) form.addEventListener('submit', handleEnrollmentSubmit);
  }

  function openEnrollmentModal(preselectedCourse) {
    const modal = $('#enrollmentModal');
    if (!modal) return;

    const form = $('#enrollmentForm');
    const success = $('#enrollmentSuccessMessage');
    const error = $('#enrollmentErrorMessage');
    const courseSelect = $('#corsoSelect');
    const courseCopy = $('#corsoSceltoInput');
    const weekSection = $('#robogrest-week-section');

    lastFocusedElement = document.activeElement;

    if (success) {
      success.style.display = 'none';
      success.setAttribute('aria-hidden', 'true');
    }
    if (error) error.style.display = 'none';

    if (form) {
      form.style.display = '';
      form.reset();
    }

    if (preselectedCourse && courseSelect) {
      courseSelect.value = preselectedCourse;
      if (courseCopy) courseCopy.value = courseSelect.value;
    } else if (courseCopy) {
      courseCopy.value = '';
    }

    if (weekSection) {
      weekSection.style.display = (preselectedCourse || '').includes('ROBOGREST') ? 'block' : 'none';
    }

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    window.clearTimeout(focusTimer);
    focusTimer = window.setTimeout(() => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const target = isMobile ? $('#closeEnrollmentModal') : $('#studentName');
      if (target) target.focus();
    }, 320);
  }

  function closeEnrollmentModal() {
    const modal = $('#enrollmentModal');
    const success = $('#enrollmentSuccessMessage');

    window.clearTimeout(focusTimer);

    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
    if (success) {
      success.style.display = 'none';
      success.setAttribute('aria-hidden', 'true');
    }

    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  function trapFocus(event, modal, success) {
    const dialog = isVisible(success) ? success : (isVisible(modal) ? modal : null);
    if (!dialog) return;

    const focusable = $$(FOCUSABLE, dialog).filter((el) => (
      el.offsetParent !== null && !el.disabled && el.type !== 'hidden' && el.tabIndex !== -1
    ));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!dialog.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  /* 09 · INVIO FORM --------------------------------------------------------- */

  async function handleEnrollmentSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = $('.enrollment-submit-btn', form);
    const submitText = $('#enrollmentSubmitText');
    const success = $('#enrollmentSuccessMessage');
    const successClose = $('#enrollmentSuccessClose');
    const modal = $('#enrollmentModal');

    const studentName = $('#studentName').value.trim();
    const studentAge = $('#studentAge').value;
    const parentEmail = $('#parentEmail').value.trim();
    const privacy = $('#privacy');

    if (!studentName) return showFormError('Inserisci il nome e cognome del bambino');
    if (!studentAge) return showFormError("Seleziona l'età del bambino");
    if (!parentEmail) return showFormError("Inserisci l'email del genitore");
    if (!privacy || !privacy.checked) return showFormError("Accetta l'informativa privacy per procedere");

    const courseValue = $('#corsoSceltoInput') ? $('#corsoSceltoInput').value : '';
    if (courseValue.includes('ROBOGREST')) {
      const weeks = $$('input[name="Settimane_Robogrest[]"]:checked');
      if (!weeks.length) return showFormError('Seleziona almeno una settimana per ROBOGREST');
    }

    const emailCopy = $('#parentEmailCopy');
    if (emailCopy) emailCopy.value = parentEmail;

    const formData = new FormData(form);
    const payload = {};
    for (const [key, value] of formData.entries()) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        payload[key] = [].concat(payload[key], value);
      } else {
        payload[key] = value;
      }
    }

    if (submitButton) submitButton.disabled = true;
    if (submitText) submitText.textContent = '⏳ Invio in corso...';

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Errore durante l'invio");

      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
      form.style.display = 'none';
      if (success) {
        success.style.display = 'flex';
        success.setAttribute('aria-hidden', 'false');
      }
      if (successClose) successClose.focus();
      form.reset();
    } catch (error) {
      const message = error.name === 'AbortError'
        ? 'La connessione è lenta o assente. Riprova o scrivici su WhatsApp.'
        : (error.message || 'Si è verificato un errore. Riprova o contattaci via WhatsApp.');
      showFormError(message);
    } finally {
      window.clearTimeout(timeout);
      if (submitButton) submitButton.disabled = false;
      if (submitText) submitText.textContent = 'Invia iscrizione';
    }
  }

  function showFormError(message) {
    const box = $('#enrollmentErrorMessage');
    const text = $('#enrollmentErrorText');
    if (text) text.textContent = message;
    if (box) {
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* 10 · SEDE / CORSO ------------------------------------------------------- */

  function initSedeLogic() {
    const applySede = () => {
      const select = $('#corsoSelect');
      if (!select) return;

      const sede = $('input[name="Sede"]:checked');
      const onlyCellatica = Boolean(sede) && sede.value === 'Cellatica';

      [...select.options].forEach((option) => {
        option.disabled = onlyCellatica && option.value !== '' && option.value !== SPIKE_COURSE;
      });

      if (onlyCellatica) {
        select.value = SPIKE_COURSE;
        const copy = $('#corsoSceltoInput');
        if (copy) copy.value = SPIKE_COURSE;
        const weeks = $('#robogrest-week-section');
        if (weeks) weeks.style.display = 'none';
      }

      const hint = $('#sedeHint');
      if (hint) hint.hidden = !onlyCellatica;
    };

    document.addEventListener('change', (event) => {
      if (event.target && event.target.name === 'Sede') applySede();
    });

    document.addEventListener('click', (event) => {
      const link = event.target.closest('.js-open-modal, .course-link[data-course]');
      if (!link) return;
      const course = link.dataset.course;
      if (course && course !== SPIKE_COURSE) {
        const brescia = $('input[name="Sede"][value="Brescia"]');
        if (brescia) brescia.checked = true;
      }
      applySede();
    });
  }
})();
