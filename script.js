/* ============================================================
   BIT Lab Tecnologici — script.js
   Scroll reveal + logica originale del sito
   ============================================================ */

/* ── SCROLL REVEAL (Intersection Observer) ─────────────────── */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function initReveal() {
    /* Aggiungi .reveal agli elementi che devono animarsi */
    const selectors = [
      '.progetto-hl',
      '.tool-card',
      '.course-card',
      '.scuola-card',
      '.bit-bar-column',
      '.progetto-img',
      '.progetto-left',
      '.hero-stepper-box',
      '.cta-scuole',
      '.section-header',
      '.collab-header',
    ];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        /* stagger sui figli dello stesso genitore */
        el.style.transitionDelay = `${i * 0.08}s`;
        observer.observe(el);
      });
    });

    /* Reveal left / right per il progetto grid */
    const pl = document.querySelector('.progetto-left');
    const pr = document.querySelector('.progetto-right');
    if (pl) { pl.classList.remove('reveal'); pl.classList.add('reveal-left'); observer.observe(pl); }
    if (pr) { pr.classList.remove('reveal'); pr.classList.add('reveal-right'); observer.observe(pr); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();

/* ── MENU HAMBURGER ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.nav-overlay');
  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      overlay.classList.toggle('open');
    });
    overlay.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => overlay.classList.remove('open'));
    });
  }

  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── POPUP SUMMER CAMP ──────────────────────────────────── */
  const popup = document.getElementById('sc-popup-overlay');
  const closeBtn = document.getElementById('sc-popup-close');
  const skipBtn = document.getElementById('sc-popup-skip');

  function closePopup() {
    if (popup) popup.style.display = 'none';
  }

  if (popup) {
    const shown = sessionStorage.getItem('sc-popup-shown');
    if (!shown) {
      setTimeout(() => {
        popup.style.display = 'flex';
        sessionStorage.setItem('sc-popup-shown', '1');
      }, 1800);
    }
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (skipBtn) skipBtn.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });
  }

  /* ── MODAL ISCRIZIONI ───────────────────────────────────── */
  const modal = document.getElementById('enrollmentModal');
  const modalOverlay = modal ? modal.querySelector('.enrollment-modal-overlay') : null;
  const closeModal = document.getElementById('closeEnrollmentModal');

  function openModal() {
    if (modal) modal.classList.add('open');
  }
  function hideModal() {
    if (modal) modal.classList.remove('open');
  }

  if (closeModal) closeModal.addEventListener('click', hideModal);
  if (modalOverlay) modalOverlay.addEventListener('click', hideModal);

  /* Esponi globalmente per compatibilità con pulsanti generati via JS */
  window.openEnrollmentModal = openModal;

  /* ── CARICAMENTO CORSI ──────────────────────────────────── */
  loadCourses();
});

/* ── FIREBASE CONFIG ────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyDtSiQAIbGxP21qMJwg5eJDNDdRBBRMsBY",
  authDomain: "bitcorsi-forms.firebaseapp.com",
  projectId: "bitcorsi-forms",
  storageBucket: "bitcorsi-forms.appspot.com",
  messagingSenderId: "397268345621",
  appId: "1:397268345621:web:a0cee474e04d7949de2c58",
};

let db;
try {
  const app = firebase.initializeApp(firebaseConfig);
  db = firebase.firestore(app);
} catch (e) {
  console.warn('Firebase non inizializzato:', e);
}

/* ── CORSI DA JSON ──────────────────────────────────────────── */
async function loadCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return;

  try {
    const res = await fetch('/corsi.json');
    if (!res.ok) throw new Error('JSON non trovato');
    const corsi = await res.json();

    container.innerHTML = '';

    corsi.forEach((corso, idx) => {
      const card = document.createElement('div');
      card.className = 'course-card reveal';
      card.style.transitionDelay = `${idx * 0.09}s`;

      const spots = corso.posti_disponibili ?? null;
      let badgeHTML = '';
      if (spots !== null) {
        const cls = spots === 0 ? 'red' : spots <= 3 ? 'orange' : 'green';
        const label = spots === 0 ? 'Completo' : spots <= 3 ? `Ultimi ${spots} posti` : `${spots} posti liberi`;
        badgeHTML = `<span class="spots-badge ${cls}">● ${label}</span>`;
      }

      const info = (corso.info || [])
        .map((i) => `<li>${i}</li>`)
        .join('');

      card.innerHTML = `
        <div class="course-header">
          ${badgeHTML}
          <div class="course-title">${corso.titolo || corso.nome}</div>
          ${corso.eta ? `<span class="course-age">${corso.eta}</span>` : ''}
        </div>
        <div class="course-price">${corso.prezzo || ''}<span>${corso.prezzo_desc || ''}</span></div>
        ${info ? `<ul class="course-info">${info}</ul>` : ''}
        ${corso.descrizione ? `<p style="font-size:.84rem;color:var(--gray-500);margin:.7rem 0;">${corso.descrizione}</p>` : ''}
        <button class="course-cta" onclick="openEnrollmentModal()" data-corso="${corso.titolo || corso.nome}">
          Iscriviti ora
        </button>
      `;

      container.appendChild(card);
    });

    /* Inizializza reveal sulle card appena create */
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    container.querySelectorAll('.course-card').forEach((el) => observer.observe(el));

    /* Popola griglia corsi nel modal */
    populateEnrollmentCourses(corsi);

  } catch (err) {
    console.warn('Caricamento corsi fallito:', err);
    container.innerHTML = `
      <div class="course-card" style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--gray-500);">
        Nessun corso disponibile al momento.
      </div>`;
  }
}

function populateEnrollmentCourses(corsi) {
  const grid = document.getElementById('enrollmentCoursesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  corsi.forEach((corso) => {
    const nome = corso.titolo || corso.nome;
    const label = document.createElement('label');
    label.style.cssText = `
      display:flex;align-items:center;gap:.6rem;padding:.6rem .85rem;
      background:var(--white);border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);
      cursor:pointer;font-size:.86rem;color:var(--gray-700);transition:border-color .2s;
    `;
    label.innerHTML = `
      <input type="radio" name="selectedCourse" value="${nome}" style="accent-color:var(--orange)">
      <span>${nome}${corso.eta ? ` — <em style="color:var(--gray-400)">${corso.eta}</em>` : ''}</span>
    `;
    label.querySelector('input').addEventListener('change', () => {
      grid.querySelectorAll('label').forEach((l) => l.style.borderColor = 'var(--gray-200)');
      label.style.borderColor = 'var(--orange)';
    });
    grid.appendChild(label);
  });
}

/* ── FORM ISCRIZIONE ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enrollmentForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('enrollmentSubmitText');
    if (btn) btn.textContent = 'Invio in corso…';

    const selectedCourse = form.querySelector('input[name="selectedCourse"]:checked');
    const data = {
      studentName:  form.studentName?.value,
      studentAge:   form.studentAge?.value,
      schoolName:   form.schoolName?.value,
      parentEmail:  form.parentEmail?.value,
      parentName:   form.parentName?.value,
      parentPhone:  form.parentPhone?.value,
      selectedCourse: selectedCourse ? selectedCourse.value : '',
      referral:     form.referral?.value,
      notes:        form.notes?.value,
      timestamp:    new Date().toISOString(),
    };

    try {
      if (db) {
        await db.collection('iscrizioni').add(data);
      }
      showMessage('enrollmentSuccessMessage', `Iscrizione per ${data.studentName} al corso "${data.selectedCourse}" confermata! Ti contatteremo a breve.`);
      form.reset();
    } catch (err) {
      console.error(err);
      showMessage('enrollmentErrorMessage', 'Si è verificato un errore. Riprova o contattaci via WhatsApp.');
    } finally {
      if (btn) btn.textContent = '✨ Iscriviti Subito!';
    }
  });
});

function showMessage(id, text) {
  ['enrollmentSuccessMessage', 'enrollmentWaitlistMessage', 'enrollmentErrorMessage'].forEach((mid) => {
    const el = document.getElementById(mid);
    if (el) el.classList.remove('show');
  });
  const target = document.getElementById(id);
  if (target) {
    const p = target.querySelector('p');
    if (p) p.textContent = text;
    target.classList.add('show');
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
