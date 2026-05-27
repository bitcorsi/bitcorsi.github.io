// ============================================================
// BIT LAB TECNOLOGICI - script.js
// Fix: link dinamici corsi, id corsi sincronizzati, submit btn
// ============================================================

// ----------------------------- FIREBASE CONFIG -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBmLKQwahwgfP5gfjgOWuEaHGq_wEuYQzQ",
  authDomain: "bitcorsi-da4b1.firebaseapp.com",
  projectId: "bitcorsi-da4b1",
  storageBucket: "bitcorsi-da4b1.firebasestorage.app",
  messagingSenderId: "98862947976",
  appId: "1:98862947976:web:abde1dea6b3c8655d5893d",
  measurementId: "G-EEDZVB4FRE"
};

if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ----------------------------- CORSI PER MODALE -----------------------------
// IMPORTANTE: le chiavi devono corrispondere agli id in corsi.json
const ENROLLMENT_COURSES = {
  'spike':           { name: 'Spike Prime Lab',    age: '8-13 anni',  max: 10 },
  'arduino':         { name: 'Arduino base',        age: '12-16 anni', max: 10 },
  'microbit':        { name: 'Micro:bit Lab',       age: '8-13 anni',  max: 10 },
  'roberta':         { name: 'Open Roberta Lab',    age: '8-13 anni',  max: 10 },
  'mattine-coding':  { name: 'ROBOGREST',           age: '7-13 anni',  max: 30 }
};

// ----------------------------- UTILITY -----------------------------
function formatDate(ts) {
  if (!ts) return '—';
  let d;
  if (ts.toDate) d = ts.toDate();
  else if (ts.seconds) d = new Date(ts.seconds * 1000);
  else d = new Date(ts);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('it-IT');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (container) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  } else {
    console.log(`[${type}] ${msg}`);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ----------------------------- INIT GENERALE -----------------------------
function init() {
  initMobileMenu();
  initFAQ();
 // initCourses();
  unifyWhatsAppFAB();
  initSummerCampPopup();
  initEnrollmentModal();
}

// ----------------------------- MENU MOBILE -----------------------------
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

// ----------------------------- FAQ (accordion) -----------------------------
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

// ----------------------------- CARICAMENTO CORSI DA JSON -----------------------------
function initCourses() {
  const container = document.getElementById('courses-container');
  const sectionHeader = document.querySelector('#corsi .section-header');
  const promoContainer = document.getElementById('promo-natale-container');
  if (!container) return;

  fetch('corsi.json?' + Date.now())
    .then(response => {
      if (!response.ok) throw new Error('corsi.json non trovato');
      return response.json();
    })
    .then(data => {
      // Aggiorna chip iscrizioni nella navbar
      aggiornaChipIscrizioni(data.corsi || []);

      // Titolo e sottotitolo sezione
      if (sectionHeader && data.titoloCorsi) {
        sectionHeader.innerHTML = `<h2>${escapeHtml(data.titoloCorsi)}</h2>
                                   <p class="section-subtitle">${escapeHtml(data.sottotitoloCorsi || '')}</p>`;
      }

      // Promo (se attiva)
      if (promoContainer && data.promoNatale && data.promoNatale.attiva) {
        const p = data.promoNatale;
        promoContainer.innerHTML = `
          <div class="promo-natale-card">
            <div class="promo-natale-icon">🌅</div>
            <div class="promo-natale-content">
              <span class="promo-badge">EDIZIONE SPECIALE</span>
              <h3>${escapeHtml(p.titolo)}</h3>
              <p class="promo-subtitle">${escapeHtml(p.sottotitolo)}</p>
              <p>${escapeHtml(p.descrizione)}</p>
              <div class="promo-meta">
                <span><strong>Date:</strong> ${escapeHtml(p.date)}</span>
                <span><strong>Età:</strong> ${escapeHtml(p.eta)}</span>
                <span><strong>Prezzo:</strong> ${escapeHtml(p.prezzo)}</span>
              </div>
              <p class="promo-note">${escapeHtml(p.posti)}</p>
              <button class="btn-promo" onclick="openEnrollmentModal()">${escapeHtml(p.cta)}</button>
            </div>
          </div>
        `;
        promoContainer.style.display = 'block';
      } else if (promoContainer) {
        promoContainer.style.display = 'none';
      }

      // Corsi normali
      container.innerHTML = '';
      const corsiNormali = (data.corsi || []).filter(c => c.tipo !== 'promo');
      if (corsiNormali.length === 0) {
        container.innerHTML = '<div class="alert-box" style="grid-column:1/-1;"><p>Nessun corso attivo al momento.</p></div>';
        return;
      }

      corsiNormali.forEach(corso => {
        const isActive = corso.stato === 'aperto​';
        const badgeClass = isActive ? 'badge-available' : 'badge-closed';
        let btn;
        if (!isActive) {
          btn = '<button class="btn-course btn-disabled" disabled>Corso non disponibile</button>';
        } else if (corso.link) {
          btn = `<a href="${escapeHtml(corso.link)}" class="btn-course" target="_blank" rel="noopener">${escapeHtml(corso.linkTesto || 'Scopri di più')}</a>`;
        } else {
          // FIX: usa onclick diretto invece di href="#contatti-info"
          // così funziona anche sui link generati dinamicamente
          btn = `<button class="btn-course" onclick="openEnrollmentModal('${escapeHtml(corso.id)}')">Assicurati un posto ora</button>`;
        }

        const card = `
          <div class="course-card">
            <div class="course-badge ${badgeClass}">${escapeHtml(corso.badge)}</div>
            <h3>${escapeHtml(corso.nome)}</h3>
            <div class="course-meta">
              <span class="meta-item">${escapeHtml(corso.eta)}</span>
              <span class="meta-item">${escapeHtml(corso.incontri)}</span>
              <span class="meta-item meta-price">${escapeHtml(corso.prezzo)}</span>
            </div>
            <div class="course-details">
              <div class="detail-row"><strong>Quando:</strong> ${escapeHtml(corso.quando)}</div>
            </div>
            <p class="course-description">${escapeHtml(corso.descrizione)}</p>
            ${btn}
          </div>
        `;
        container.innerHTML += card;
      });
    })
    .catch(err => {
      console.error('Errore caricamento corsi:', err);
      if (sectionHeader) {
        sectionHeader.innerHTML = '<h2>Corsi e Laboratori</h2><p class="section-subtitle">Informazioni temporaneamente non disponibili</p>';
      }
      if (promoContainer) promoContainer.style.display = 'none';
      container.innerHTML = '<div class="alert-box" style="grid-column:1/-1;"><strong>Impossibile caricare i corsi</strong><p>Contattaci per info aggiornate.</p></div>';
    });
}

// Aggiorna chip "Iscrizioni aperte/chiuse" nella navbar
function aggiornaChipIscrizioni(corsi) {
  const hasOpen = corsi.some(c => c.stato === 'aperto');
  document.querySelectorAll('.nav-chip').forEach(chip => {
    if (hasOpen) {
      chip.innerHTML = '<div class="nav-chip-dot"></div> Iscrizioni aperte';
      chip.style.color = '#E05A2B';
      chip.style.background = '#fff4f0';
      chip.style.borderColor = '#ffd4c0';
    } else {
      chip.innerHTML = '<div class="nav-chip-dot" style="background:#9ca3af"></div> Iscrizioni chiuse';
      chip.style.color = '#6b7280';
      chip.style.background = '#f3f4f6';
      chip.style.borderColor = '#e5e7eb';
    }
  });
}

// ----------------------------- WHATSAPP FAB -----------------------------
function unifyWhatsAppFAB() {
  const fab = document.querySelector('.fab-whatsapp');
  const staticIcon = document.getElementById('whatsapp-static');
  if (!fab || !staticIcon) return;

  const originalStyle = {
    position: fab.style.position,
    left: fab.style.left,
    top: fab.style.top,
    transform: fab.style.transform,
    zIndex: fab.style.zIndex,
    pointerEvents: fab.style.pointerEvents
  };

  function updatePosition() {
    const rect = staticIcon.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      const centerX = rect.left + window.scrollX + rect.width / 2;
      const centerY = rect.top + window.scrollY + rect.height / 2;
      fab.style.position = 'fixed';
      fab.style.left = (centerX - 28) + 'px';
      fab.style.top = (centerY - 28) + 'px';
      fab.style.transform = 'scale(0.64)';
      fab.style.zIndex = '10000';
      fab.style.pointerEvents = 'none';
      fab.style.opacity = '1';
    } else {
      Object.assign(fab.style, originalStyle);
      fab.style.opacity = '';
    }
  }

  updatePosition();
  window.addEventListener('scroll', () => requestAnimationFrame(updatePosition));
  window.addEventListener('resize', updatePosition);
}

// ----------------------------- POPUP SUMMER CAMP -----------------------------
function initSummerCampPopup() {
  const SESSION_KEY = 'sc_popup_shown';
  if (sessionStorage.getItem(SESSION_KEY)) return;
  const overlay = document.getElementById('sc-popup-overlay');
  if (!overlay) return;

  function closePopup() {
    overlay.classList.remove('sc-open');
    setTimeout(() => overlay.style.display = 'none', 280);
  }

  const closeBtn = document.getElementById('sc-popup-close');
  const skipBtn = document.getElementById('sc-popup-skip');
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (skipBtn) skipBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

  setTimeout(() => {
    sessionStorage.setItem(SESSION_KEY, '1');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('sc-open'));
  }, 8000);
}

// ----------------------------- MODALE ISCRIZIONI -----------------------------
function initEnrollmentModal() {
  const modal = document.getElementById('enrollmentModal');
  const closeBtn = document.getElementById('closeEnrollmentModal');
  if (!modal) return;

  // Chiusura
  if (closeBtn) closeBtn.addEventListener('click', closeEnrollmentModal);
  const overlay = modal.querySelector('.enrollment-modal-overlay');
  if (overlay) overlay.addEventListener('click', closeEnrollmentModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeEnrollmentModal();
  });

  // FIX: aggancia link statici #contatti-info presenti nell'HTML originale
  document.querySelectorAll('a[href="#contatti-info"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openEnrollmentModal();
    });
  });

  // Submit del form
  const form = document.getElementById('enrollmentForm');
  if (form) {
    form.addEventListener('submit', handleEnrollmentSubmit);
  }
}

// Funzione globale per aprire il modal (usata anche dai btn dinamici)
function openEnrollmentModal(preselectCourseId) {
  const modal = document.getElementById('enrollmentModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const grid = document.getElementById('enrollmentCoursesGrid');
  if (grid && grid.children.length === 0) {
    populateEnrollmentCourses(preselectCourseId);
  } else if (grid && preselectCourseId) {
    // Preseleziona il corso se già caricato
    const radio = document.getElementById('enrollment-course-' + preselectCourseId);
    if (radio && !radio.disabled) radio.checked = true;
  }
}

function closeEnrollmentModal() {
  const modal = document.getElementById('enrollmentModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Popola griglia corsi nel modal con disponibilità da Firestore
function populateEnrollmentCourses(preselectCourseId) {
  const grid = document.getElementById('enrollmentCoursesGrid');
  if (!grid) return;
  grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#999; padding: 1rem;">Caricamento corsi...</p>';

  const promises = Object.keys(ENROLLMENT_COURSES).map(courseId => {
    return getCourseAvailability(courseId).catch(() => {
      const info = ENROLLMENT_COURSES[courseId];
      return { courseId, confirmed: 0, available: info.max, isFull: false };
    });
  });

  Promise.all(promises).then(results => {
    grid.innerHTML = '';
    results.forEach(data => {
      const info = ENROLLMENT_COURSES[data.courseId];
      if (!info) return;
      const availClass = data.isFull ? 'full' : (data.available <= 2 ? 'limited' : 'available');
      const availText = data.isFull ? '❌ Corso Pieno' : `✓ ${data.available} posti liberi`;
      const isPreselected = preselectCourseId && data.courseId === preselectCourseId && !data.isFull;
      grid.innerHTML += `
        <div class="enrollment-course-option">
          <input type="radio" id="enrollment-course-${data.courseId}" name="courseId" value="${data.courseId}" ${data.isFull ? 'disabled' : ''} ${isPreselected ? 'checked' : ''}>
          <label for="enrollment-course-${data.courseId}" class="enrollment-course-label">
            <strong>${escapeHtml(info.name)}</strong>
            <small>${escapeHtml(info.age)}</small>
            <div class="enrollment-course-availability ${availClass}">${availText}</div>
          </label>
        </div>
      `;
    });
  });
}

// Disponibilità corso da Firestore
function getCourseAvailability(courseId) {
  const info = ENROLLMENT_COURSES[courseId];
  return db.collection('enrollments')
    .where('courseId', '==', courseId)
    .where('status', '==', 'confermato')
    .get()
    .then(snapshot => ({
      courseId,
      confirmed: snapshot.size,
      available: Math.max(0, info.max - snapshot.size),
      isFull: snapshot.size >= info.max
    }));
}

// Submit iscrizione
async function handleEnrollmentSubmit(e) {
  e.preventDefault();

  const successMsg = document.getElementById('enrollmentSuccessMessage');
  const errorMsg = document.getElementById('enrollmentErrorMessage');
  const waitlistMsg = document.getElementById('enrollmentWaitlistMessage');
  const submitBtn = document.getElementById('enrollmentSubmitBtn') || document.querySelector('.enrollment-submit-btn');
  const submitTextSpan = document.getElementById('enrollmentSubmitText');

  if (successMsg) successMsg.classList.remove('show');
  if (errorMsg) errorMsg.classList.remove('show');
  if (waitlistMsg) waitlistMsg.classList.remove('show');

  if (submitBtn) {
    submitBtn.disabled = true;
    if (submitTextSpan) submitTextSpan.textContent = '⏳ Elaborazione...';
    else submitBtn.innerHTML = '⏳ Elaborazione...';
  }

  try {
    const courseRadio = document.querySelector('input[name="courseId"]:checked');
    if (!courseRadio) throw new Error('Seleziona un corso prima di procedere');

    const studentName = document.getElementById('studentName').value.trim();
    const studentAge = document.getElementById('studentAge').value;
    const parentEmail = document.getElementById('parentEmail').value.trim();
    const privacy = document.getElementById('privacy');

    if (!studentName) throw new Error('Inserisci il nome e cognome del bambino');
    if (!studentAge) throw new Error("Seleziona l'età del bambino");
    if (!parentEmail) throw new Error("Inserisci l'email del genitore");
    if (!privacy || !privacy.checked) throw new Error("Accetta l'informativa privacy per procedere");

    const formData = {
      studentName,
      studentAge: parseInt(studentAge),
      parentName: document.getElementById('parentName').value.trim(),
      parentEmail,
      parentPhone: document.getElementById('parentPhone').value.trim(),
      schoolName: document.getElementById('schoolName').value.trim(),
      courseId: courseRadio.value,
      referral: document.getElementById('referral').value,
      notes: document.getElementById('notes').value.trim()
    };

    await saveEnrollmentToFirebase(formData);

    // Mostra successo
    const successText = document.getElementById('enrollmentSuccessText');
    if (successText) successText.innerText = `Ci vediamo presto in laboratorio! 🤖`;
    if (successMsg) successMsg.classList.add('show');

    // Reset
    document.getElementById('enrollmentForm').reset();
    const grid = document.getElementById('enrollmentCoursesGrid');
    if (grid) grid.innerHTML = '';

    // Chiudi modal dopo 3 secondi
    setTimeout(() => closeEnrollmentModal(), 3000);

  } catch (err) {
    console.error('Errore iscrizione:', err);
    const errorText = document.getElementById('enrollmentErrorText');
    if (errorText) errorText.innerText = err.message || "Errore durante l'iscrizione. Riprova.";
    if (errorMsg) errorMsg.classList.add('show');
    // Scroll al messaggio di errore
    if (errorMsg) errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      if (submitTextSpan) submitTextSpan.textContent = '✨ Iscriviti Subito!';
      else submitBtn.innerHTML = '✨ Iscriviti Subito!';
    }
  }
}

// Salva su Firestore (confermato o lista d'attesa)
async function saveEnrollmentToFirebase(formData) {
  const info = ENROLLMENT_COURSES[formData.courseId];
  if (!info) throw new Error('Corso non valido. Ricarica la pagina e riprova.');

  const snapshot = await db.collection('enrollments')
    .where('courseId', '==', formData.courseId)
    .where('status', '==', 'confermato')
    .get();

  const confirmed = snapshot.size;
  const status = confirmed >= info.max ? 'in_attesa' : 'confermato';
  const waitlistPosition = status === 'in_attesa' ? (confirmed - info.max + 1) : null;

  await db.collection('enrollments').add({
    studentName: formData.studentName,
    studentAge: formData.studentAge,
    parentName: formData.parentName,
    parentEmail: formData.parentEmail,
    parentPhone: formData.parentPhone,
    schoolName: formData.schoolName,
    courseId: formData.courseId,
    courseName: info.name,
    status,
    waitlistPosition,
    paid: false,
    referral: formData.referral,
    notes: formData.notes,
    enrollmentDate: new Date()
  });

  // Mostra messaggio lista d'attesa se necessario
  if (status === 'in_attesa') {
    const waitlistMsg = document.getElementById('enrollmentWaitlistMessage');
    const waitlistText = document.getElementById('enrollmentWaitlistText');
    if (waitlistText) waitlistText.innerText = `Sei in lista d'attesa (posizione ${waitlistPosition}). Ti contatteremo appena si libera un posto!`;
    if (waitlistMsg) waitlistMsg.classList.add('show');
    // Nascondi il messaggio di successo generico
    const successMsg = document.getElementById('enrollmentSuccessMessage');
    if (successMsg) successMsg.classList.remove('show');
  }
}

// ----------------------------- AVVIO -----------------------------
document.addEventListener('DOMContentLoaded', init);
