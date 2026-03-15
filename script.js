// ========================================
// INIZIALIZZAZIONE
// ========================================

document.addEventListener(‘DOMContentLoaded’, function () {
initMobileMenu();
initFAQ();
initContactForm();
initCourses();
unifyWhatsAppFAB();
});

window.addEventListener(‘error’, function (e) {
console.error(‘Errore JavaScript:’, e.error);
});

// ========================================
// MENU MOBILE
// ========================================

function initMobileMenu() {
const menuToggle = document.querySelector(’.menu-toggle’);
const navOverlay = document.querySelector(’.nav-overlay’);
const body = document.body;

```
if (!menuToggle || !navOverlay) return;

function closeMenu() {
    navOverlay.classList.remove('active');
    menuToggle.classList.remove('open');
    body.style.overflow = '';
}

function openMenu() {
    navOverlay.classList.add('active');
    menuToggle.classList.add('open');
    body.style.overflow = 'hidden';
}

// Bottone hamburger
menuToggle.addEventListener('click', function () {
    navOverlay.classList.contains('active') ? closeMenu() : openMenu();
});

// Click su un link del menu
navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Click fuori dal menu (sullo sfondo)
navOverlay.addEventListener('click', function (e) {
    if (e.target === navOverlay) closeMenu();
});

// Tasto ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navOverlay.classList.contains('active')) closeMenu();
});
```

}

// ========================================
// FAQ ACCORDION
// ========================================

function initFAQ() {
const faqItems = document.querySelectorAll(’.faq-list details’);

```
faqItems.forEach(item => {
    item.addEventListener('toggle', function () {
        if (this.open) {
            faqItems.forEach(other => {
                if (other !== this && other.open) other.open = false;
            });
        }
    });
});
```

}

// ========================================
// FORM ISCRIZIONE
// ========================================

function initContactForm() {
const form = document.getElementById(‘iscrizione-form’);
const messageEl = document.getElementById(‘form-message’);

```
if (!form) return;

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.btn-submit');
    if (!submitBtn || submitBtn.disabled) return;

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio…';

    if (messageEl) {
        messageEl.className = 'form-message';
        messageEl.textContent = '';
    }

    try {
        const response = await fetch(this.action.trim(), {
            method: 'POST',
            body: new FormData(this)
        });

        let success = false;
        const contentType = response.headers.get('content-type') || '';

        if (response.ok) {
            if (contentType.includes('application/json')) {
                const data = await response.json();
                success = !!data.success;
            } else {
                const text = await response.text();
                success = text.includes('success') || text.includes('Thank you');
            }
        }

        if (success) {
            this.reset();
            showMessage(messageEl, '✅ Iscrizione inviata con successo!', 'success');
        } else {
            throw new Error('Risposta non valida');
        }

    } catch (error) {
        console.error('❌ Invio fallito:', error);
        showMessage(messageEl, '❌ Errore: controlla i dati e riprova.', 'error');
    } finally {
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 600);
    }
});
```

}

function showMessage(el, text, type) {
if (!el) return;
el.textContent = text;
el.className = `form-message ${type}`;
if (type === ‘success’) {
setTimeout(() => {
el.className = ‘form-message’;
setTimeout(() => el.textContent = ‘’, 300);
}, 5000);
}
}

// ========================================
// CORSI DINAMICI
// ========================================

function initCourses() {
const container = document.getElementById(‘courses-container’);
const sectionHeader = document.querySelector(’#corsi .section-header’);
const promoContainer = document.getElementById(‘promo-natale-container’);

```
if (!container) return;

fetch('corsi.json?' + Date.now())
    .then(r => {
        if (!r.ok) throw new Error('corsi.json non trovato');
        return r.json();
    })
    .then(data => {
        // Titolo sezione
        if (sectionHeader && data.titoloCorsi) {
            sectionHeader.innerHTML = `
                <h2>${data.titoloCorsi}</h2>
                <p class="section-subtitle">${data.sottotitoloCorsi || ''}</p>
            `;
        }

        // Promo (se attiva)
        if (promoContainer) {
            const p = data.promoNatale;
            if (p?.attiva) {
                promoContainer.innerHTML = buildPromoCard(p);
                promoContainer.style.display = 'block';
            } else {
                promoContainer.style.display = 'none';
            }
        }

        // Corsi normali
        const corsi = data.corsi?.filter(c => c.tipo !== 'promo') || [];
        container.innerHTML = corsi.length > 0
            ? corsi.map(buildCourseCard).join('')
            : `<div class="alert-box" style="grid-column:1/-1;"><p>Nessun corso attivo al momento.</p></div>`;
    })
    .catch(err => {
        console.error('❌ Errore caricamento corsi:', err);
        if (sectionHeader) {
            sectionHeader.innerHTML = `
                <h2>Corsi e Laboratori</h2>
                <p class="section-subtitle">Informazioni temporaneamente non disponibili</p>
            `;
        }
        if (promoContainer) promoContainer.style.display = 'none';
        container.innerHTML = `
            <div class="alert-box" style="grid-column:1/-1;">
                <strong>⚠️ Impossibile caricare i corsi</strong>
                <p>Contattaci per info aggiornate.</p>
            </div>
        `;
    });
```

}

function buildCourseCard(corso) {
const isActive = corso.stato === ‘aperto’;
const btn = isActive
? `<a href="#contatti" class="btn-course">Iscriviti ora</a>`
: `<button class="btn-course btn-disabled" disabled>Corso in svolgimento</button>`;

```
return `
    <div class="course-card">
        <div class="course-badge ${isActive ? 'badge-available' : 'badge-closed'}">${corso.badge}</div>
        <h3>${corso.nome}</h3>
        <div class="course-meta">
            <span class="meta-item">${corso.eta}</span>
            <span class="meta-item">${corso.incontri}</span>
            <span class="meta-item meta-price">${corso.prezzo}</span>
        </div>
        <div class="course-details">
            <div class="detail-row"><strong>Quando:</strong> ${corso.quando}</div>
        </div>
        <p class="course-description">${corso.descrizione}</p>
        ${btn}
    </div>
`;
```

}

function buildPromoCard(p) {
return `<div class="promo-natale-card"> <div class="promo-natale-icon"> <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"> <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M14 20a3 3 0 1 0-4 0M10 4a3 3 0 0 0 4 0"/> </svg> </div> <div class="promo-natale-content"> <span class="promo-badge">EDIZIONE SPECIALE</span> <h3>${p.titolo}</h3> <p class="promo-subtitle">${p.sottotitolo}</p> <p>${p.descrizione}</p> <div class="promo-meta"> <span><strong>Date:</strong> ${p.date}</span> <span><strong>Età:</strong> ${p.eta}</span> <span><strong>Prezzo:</strong> ${p.prezzo}</span> </div> <p class="promo-note">${p.posti}</p> <a href="#contatti" class="btn-promo">${p.cta}</a> </div> </div>`;
}

// ========================================
// UNIFICAZIONE FAB WHATSAPP ↔ ICONA FISSA
// ========================================

function unifyWhatsAppFAB() {
const fab = document.querySelector(’.fab-whatsapp’);
const staticIcon = document.getElementById(‘whatsapp-static’);

```
if (!fab || !staticIcon) return;

function updatePosition() {
    const rect = staticIcon.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
        fab.style.position = 'fixed';
        fab.style.left = (rect.left + rect.width / 2 - 28) + 'px';
        fab.style.top  = (rect.top  + rect.height / 2 - 28) + 'px';
        fab.style.transform = 'scale(0.64)';
        fab.style.zIndex = '10000';
        fab.style.pointerEvents = 'none';
        fab.style.opacity = '1';
    } else {
        fab.style.cssText = '';
    }
}

updatePosition();
window.addEventListener('scroll', () => requestAnimationFrame(updatePosition));
window.addEventListener('resize', updatePosition);
```

}